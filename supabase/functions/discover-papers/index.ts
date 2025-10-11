import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Paper {
  title: string;
  authors: string[];
  abstract: string;
  year: number;
  venue: string;
  url: string;
  paperId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, projectId } = await req.json();
    
    if (!topic || !projectId) {
      throw new Error("Topic and projectId are required");
    }

    console.log("Searching for papers on topic:", topic);

    // Fetch papers from Semantic Scholar API
    const semanticScholarUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(topic)}&limit=5&fields=title,authors,abstract,year,venue,url,paperId`;
    
    const response = await fetch(semanticScholarUrl);
    
    if (!response.ok) {
      console.error("Semantic Scholar API error:", response.status);
      throw new Error("Failed to fetch papers from Semantic Scholar");
    }

    const data = await response.json();
    const papers: Paper[] = data.data || [];

    console.log(`Found ${papers.length} papers`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Process each paper: summarize, extract keywords, generate citations
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    
    for (const paper of papers) {
      if (!paper.abstract) continue;

      // Generate summary using Lovable AI
      let summary = paper.abstract.substring(0, 200) + "...";
      let keywords: string[] = [];

      try {
        // Summarization
        const summaryResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
                content: "You are a research assistant. Provide a concise 2-3 sentence summary of the abstract."
              },
              {
                role: "user",
                content: `Summarize this abstract:\n\n${paper.abstract}`
              }
            ],
          }),
        });

        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          summary = summaryData.choices?.[0]?.message?.content || summary;
        }

        // Keyword extraction
        const keywordResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
                content: "You are a research assistant. Extract 5-7 key technical terms or keywords from the text. Return only comma-separated keywords, no other text."
              },
              {
                role: "user",
                content: paper.abstract
              }
            ],
          }),
        });

        if (keywordResponse.ok) {
          const keywordData = await keywordResponse.json();
          const keywordText = keywordData.choices?.[0]?.message?.content || "";
          keywords = keywordText.split(",").map((k: string) => k.trim()).filter((k: string) => k.length > 0);
        }
      } catch (error) {
        console.error("AI processing error:", error);
      }

      // Generate citations
      const authorNames = paper.authors.map((a: any) => a.name || "Unknown").join(", ");
      
      const citationApa = `${authorNames} (${paper.year}). ${paper.title}. ${paper.venue || "Conference/Journal"}. ${paper.url || ""}`;
      const citationMla = `${authorNames}. "${paper.title}." ${paper.venue || "Conference/Journal"} (${paper.year}). ${paper.url || ""}`;
      const citationIeee = `${authorNames}, "${paper.title}," ${paper.venue || "Conference/Journal"}, ${paper.year}. ${paper.url || ""}`;

      // Save to database
      const { error: insertError } = await supabase.from("papers").insert({
        project_id: projectId,
        title: paper.title,
        authors: paper.authors.map((a: any) => a.name || "Unknown"),
        abstract: paper.abstract,
        summary,
        keywords,
        citation_apa: citationApa,
        citation_mla: citationMla,
        citation_ieee: citationIeee,
        year: paper.year,
        venue: paper.venue || "Unknown",
        url: paper.url || "",
        external_id: paper.paperId,
      });

      if (insertError) {
        console.error("Error inserting paper:", insertError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, papers: papers.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in discover-papers:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
