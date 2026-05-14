import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Paper {
  title: string;
  authors: string[];
  abstract: string;
  year: number;
  venue: string;
  url: string;
  paperId: string;
}

async function enrichPaperWithAI(
  paper: Paper,
  lovableApiKey: string
): Promise<{ summary: string; keywords: string[]; mlCategory: string }> {
  const fallback = {
    summary: paper.abstract?.substring(0, 200) + "..." || "",
    keywords: [],
    mlCategory: "Uncategorized",
  };

  if (!paper.abstract) return fallback;

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a research assistant. Given a paper title and abstract, return a JSON object with exactly these fields:
1. "summary": A concise 2-3 sentence summary of the abstract.
2. "keywords": An array of 5-7 key technical terms.
3. "mlCategory": Classify into exactly ONE of: Computer Vision, Natural Language Processing, Astrophysics, Combinatorics, Neuroscience, High Energy Physics, Machine Learning, Mathematics, Biology, Chemistry, Economics, Other.
Return ONLY valid JSON, no markdown.`
          },
          {
            role: "user",
            content: `Title: ${paper.title}\n\nAbstract: ${paper.abstract}`
          }
        ],
      }),
    });

    if (!response.ok) return fallback;

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      summary: parsed.summary || fallback.summary,
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : fallback.keywords,
      mlCategory: parsed.mlCategory || fallback.mlCategory,
    };
  } catch (error) {
    console.error("AI enrichment error:", error);
    return fallback;
  }
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- AuthN: validate JWT ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    const token = authHeader.slice("Bearer ".length);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser(token);
    if (userErr || !userData?.user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    const userId = userData.user.id;

    // --- Input validation ---
    let body: any;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    const topic = typeof body?.topic === "string" ? body.topic.trim() : "";
    const projectId = typeof body?.projectId === "string" ? body.projectId : "";
    const rawOffset = body?.offset;

    if (!topic || topic.length > 200) {
      return jsonResponse({ error: "Invalid topic (1-200 chars required)" }, 400);
    }
    if (!UUID_RE.test(projectId)) {
      return jsonResponse({ error: "Invalid projectId" }, 400);
    }
    let offset = 0;
    if (rawOffset !== undefined) {
      const n = Number(rawOffset);
      if (!Number.isInteger(n) || n < 0 || n > 1000) {
        return jsonResponse({ error: "Invalid offset" }, 400);
      }
      offset = n;
    }

    // --- AuthZ: verify project ownership ---
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: project, error: projErr } = await admin
      .from("projects")
      .select("id, user_id")
      .eq("id", projectId)
      .maybeSingle();

    if (projErr) {
      console.error("Project lookup error:", projErr);
      return jsonResponse({ error: "Server error" }, 500);
    }
    if (!project) return jsonResponse({ error: "Project not found" }, 404);
    if (project.user_id !== userId) {
      return jsonResponse({ error: "Forbidden" }, 403);
    }

    console.log("Searching for papers on topic:", topic, "offset:", offset);

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    // Restrict to papers from 1900 through 2026 (current + recent years), newest first.
    const currentYear = new Date().getFullYear();
    const maxYear = Math.max(currentYear, 2026);
    const yearRange = `1900-${maxYear}`;
    const semanticScholarUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(topic)}&limit=5&offset=${offset}&year=${yearRange}&fields=title,authors,abstract,year,venue,url,paperId`;

    let response: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await new Promise(r => setTimeout(r, attempt * 2000));
      }
      response = await fetch(semanticScholarUrl);
      if (response.ok || response.status !== 429) break;
      await response.text();
    }

    let papers: Paper[] = [];

    if (!response || !response.ok) {
      const status = response?.status || 0;
      console.error("Semantic Scholar API error:", status);

      if (status === 429) {
        const fallbackResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: "Generate 5 real, well-known research papers related to the given topic. Return a JSON array with objects: title, authors (string array), abstract (2-3 sentences), year (number), venue (string), url (empty string), paperId (empty string). Return ONLY valid JSON."
              },
              { role: "user", content: `Generate 5 real research papers about: ${topic}` }
            ],
          }),
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const content = fallbackData.choices?.[0]?.message?.content || "[]";
          try {
            const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            papers = JSON.parse(cleaned);
          } catch (parseErr) {
            console.error("Failed to parse AI fallback:", parseErr);
            return jsonResponse({ error: "Upstream unavailable, please try again." }, 502);
          }
        } else {
          return jsonResponse({ error: "Upstream unavailable, please try again." }, 502);
        }
      } else {
        return jsonResponse({ error: "Upstream error, please try again." }, 502);
      }
    } else {
      const data = await response.json();
      papers = data.data || [];
    }

    console.log(`Processing ${papers.length} papers in parallel`);

    const results = await Promise.allSettled(
      papers.map(async (paper) => {
        const { summary, keywords, mlCategory } = await enrichPaperWithAI(paper, lovableApiKey!);

        const authorNames = paper.authors?.map((a: any) => typeof a === 'string' ? a : a.name || "Unknown") || ["Unknown"];
        const authorStr = authorNames.join(", ");

        const citationApa = `${authorStr} (${paper.year}). ${paper.title}. ${paper.venue || "Conference/Journal"}.`;
        const citationMla = `${authorStr}. "${paper.title}." ${paper.venue || "Conference/Journal"} (${paper.year}).`;
        const citationIeee = `${authorStr}, "${paper.title}," ${paper.venue || "Conference/Journal"}, ${paper.year}.`;

        const { error: insertError } = await admin.from("papers").insert({
          project_id: projectId,
          title: paper.title,
          authors: authorNames,
          abstract: paper.abstract || "",
          summary,
          keywords: [...keywords, `[ML:${mlCategory}]`],
          citation_apa: citationApa,
          citation_mla: citationMla,
          citation_ieee: citationIeee,
          year: paper.year || new Date().getFullYear(),
          venue: paper.venue || "Unknown",
          url: paper.url || "",
          external_id: paper.paperId || "",
        });

        if (insertError) {
          console.error("Error inserting paper:", insertError);
        }
      })
    );

    const succeeded = results.filter(r => r.status === "fulfilled").length;
    console.log(`Processed ${succeeded}/${papers.length} papers successfully`);

    return jsonResponse({ success: true, papers: succeeded });
  } catch (error) {
    console.error("Error in discover-papers:", error);
    return jsonResponse({ error: "Server error" }, 500);
  }
});
