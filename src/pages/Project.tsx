import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Search, Loader2, BookOpen, Download, FileText, Presentation, Plus } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import PaperCard from "@/components/PaperCard";
import { generateProjectPPT } from "@/lib/pptGenerator";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  summary: string;
  keywords: string[];
  citation_apa: string;
  citation_mla: string;
  citation_ieee: string;
  year: number;
  venue: string;
  url: string;
  ml_category?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
}

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTopic, setSearchTopic] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastSearchTopic, setLastSearchTopic] = useState("");
  const [searchOffset, setSearchOffset] = useState(0);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session && id) {
      fetchProject();
      fetchPapers();
    }
  }, [session, id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error: any) {
      toast.error("Failed to load project");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchPapers = async () => {
    try {
      const { data, error } = await supabase
        .from("papers")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPapers(data || []);
    } catch (error: any) {
      console.error("Error fetching papers:", error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTopic.trim()) return;

    setSearching(true);
    toast.info("Discovering papers... This may take a moment.");
    try {
      const { data, error } = await supabase.functions.invoke("discover-papers", {
        body: { topic: searchTopic, projectId: id, offset: 0 },
      });

      if (error) throw error;
      
      const count = data?.papers || 0;
      toast.success(`Found ${count} papers!`);
      setLastSearchTopic(searchTopic);
      setSearchOffset(5);
      fetchPapers();
    } catch (error: any) {
      toast.error(error.message || "Failed to discover papers");
    } finally {
      setSearching(false);
    }
  };

  const handleLoadMore = async () => {
    if (!lastSearchTopic) return;
    setLoadingMore(true);
    toast.info("Fetching more papers...");
    try {
      const { data, error } = await supabase.functions.invoke("discover-papers", {
        body: { topic: lastSearchTopic, projectId: id, offset: searchOffset },
      });
      if (error) throw error;
      const count = data?.papers || 0;
      toast.success(`Found ${count} more papers!`);
      setSearchOffset(prev => prev + 5);
      fetchPapers();
    } catch (error: any) {
      toast.error(error.message || "Failed to load more papers");
    } finally {
      setLoadingMore(false);
    }
  };

  const exportCitations = (format: "apa" | "mla" | "ieee") => {
    const citations = papers.map(paper => {
      switch (format) {
        case "apa": return paper.citation_apa;
        case "mla": return paper.citation_mla;
        case "ieee": return paper.citation_ieee;
        default: return paper.citation_apa;
      }
    }).join("\n\n");

    const blob = new Blob([citations], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `citations-${format}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPPT = async () => {
    try {
      toast.info("Generating presentation...");
      await generateProjectPPT();
      toast.success("Presentation downloaded!");
    } catch (error) {
      console.error("PPT generation error:", error);
      toast.error("Failed to generate presentation");
    }
  };

  const handleDownloadReport = () => {
    window.open("/project_report.tex", "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">{project?.name}</h1>
              </div>
              {project?.description && (
                <p className="text-muted-foreground">{project.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadPPT}>
                <Presentation className="h-4 w-4 mr-2" />
                Download PPT
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadReport}>
                <FileText className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="p-6 mb-8 shadow-card animate-fade-in">
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              placeholder="Enter research topic (e.g., machine learning, quantum computing)..."
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={searching}>
              {searching ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Discover Papers
            </Button>
          </form>
        </Card>

        {papers.length > 0 && (
          <div className="mb-6 flex gap-2 animate-fade-in">
            <Button variant="outline" size="sm" onClick={() => exportCitations("apa")}>
              <Download className="h-4 w-4 mr-2" />
              Export APA
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportCitations("mla")}>
              <Download className="h-4 w-4 mr-2" />
              Export MLA
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportCitations("ieee")}>
              <Download className="h-4 w-4 mr-2" />
              Export IEEE
            </Button>
          </div>
        )}

        {papers.length === 0 ? (
          <Card className="p-12 text-center shadow-card animate-scale-in">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No papers yet</h3>
            <p className="text-muted-foreground">
              Search for a topic to discover relevant research papers
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {papers.map((paper, index) => (
              <PaperCard
                key={paper.id}
                paper={paper}
                index={index}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Project;
