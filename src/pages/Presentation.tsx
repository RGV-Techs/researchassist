import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, FileText, Layers, Database, Cpu, Shield, Clock, Lightbulb } from "lucide-react";
import { generateProjectPPT } from "@/lib/pptGenerator";
import { presentationContent } from "@/data/presentationContent";

const Presentation = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateProjectPPT();
    } catch (error) {
      console.error("Error generating PPT:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const slidePreview = [
    { icon: FileText, title: "Title Slide", description: "Project introduction and branding" },
    { icon: Lightbulb, title: "Problem Statement", description: "Information overload challenges" },
    { icon: Lightbulb, title: "Proposed Solution", description: "AI-powered research assistant" },
    { icon: Layers, title: "System Architecture", description: "Diagram: multi-layer architecture" },
    { icon: Cpu, title: "Technology Stack", description: "React, Tailwind, Gemini AI" },
    { icon: Database, title: "Database Schema", description: "Profiles, Projects, Papers tables" },
    { icon: Layers, title: "Data Flow", description: "Diagram: discovery pipeline" },
    { icon: Lightbulb, title: "Key Features", description: "Discovery, AI, Citations" },
    { icon: Cpu, title: "AI Pipeline", description: "Summarization, keywords & classification" },
    { icon: Database, title: "Dataset & Preprocessing", description: "arXiv 18K papers, TF-IDF 50K features" },
    { icon: Cpu, title: "ML Pipeline", description: "Diagram: end-to-end ML flow" },
    { icon: Cpu, title: "ML Model Results", description: "Table: 5 models, 97.25% best" },
    { icon: Cpu, title: "Model Comparison", description: "Chart: accuracy & F1 scores" },
    { icon: Cpu, title: "Per-Class Performance", description: "Table: F1 per domain (0.97)" },
    { icon: Cpu, title: "Confusion Matrix", description: "Diagram: 6-class heatmap" },
    { icon: Cpu, title: "Validation Summary", description: "CV accuracy, feature space" },
    { icon: Shield, title: "Security", description: "RLS policies & JWT auth" },
    { icon: Shield, title: "Testing Strategy", description: "Unit, integration, ML tests" },
    { icon: Clock, title: "Project Timeline", description: "12-week development phases" },
    { icon: Lightbulb, title: "Future Enhancements", description: "Similarity, PDF parsing, collaboration" },
    { icon: FileText, title: "Conclusion", description: "Summary of achievements" },
    { icon: FileText, title: "References", description: "Documentation sources" },
    { icon: FileText, title: "Thank You", description: "Questions & discussion" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Presentation Generator</h1>
                <p className="text-sm text-muted-foreground">Download project documentation as PowerPoint</p>
              </div>
            </div>
            <Button 
              onClick={handleDownload} 
              disabled={isGenerating}
              className="gap-2"
              size="lg"
            >
              <Download className="h-5 w-5" />
              {isGenerating ? "Generating..." : "Download PPT"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Info Card */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {presentationContent.title.main}
            </CardTitle>
            <CardDescription className="text-base">
              {presentationContent.title.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Total Slides</span>
                <span className="text-2xl font-bold text-foreground">23</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Format</span>
                <span className="text-2xl font-bold text-foreground">.pptx</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Date</span>
                <span className="text-lg font-semibold text-foreground">{presentationContent.title.date}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Author</span>
                <span className="text-lg font-semibold text-foreground">Research Project</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Slide Preview Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Slide Preview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {slidePreview.map((slide, index) => (
              <Card 
                key={index} 
                className="group hover:border-primary/50 hover:shadow-md transition-all cursor-default"
              >
                <CardContent className="p-3">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <slide.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">Slide {index + 1}</p>
                      <p className="text-sm font-semibold text-foreground leading-tight">{slide.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Features Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {presentationContent.keyFeatures.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">{feature.name}</span>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {presentationContent.techStack.items.map((item, index) => (
                  <li key={index} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{item.category}</span>
                    <span className="font-medium text-foreground text-sm">{item.technology}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {presentationContent.timeline.phases.map((phase, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-semibold shrink-0">
                      W{phase.week}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{phase.phase}</span>
                      <p className="text-sm text-muted-foreground">{phase.tasks}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Future Enhancements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Future Enhancements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {presentationContent.futureEnhancements.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Download CTA */}
        <div className="mt-8 text-center">
          <Button 
            onClick={handleDownload} 
            disabled={isGenerating}
            size="lg"
            className="gap-2"
          >
            <Download className="h-5 w-5" />
            {isGenerating ? "Generating Presentation..." : "Download PowerPoint Presentation"}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            The presentation will be downloaded as "Autonomous_Research_Assistant_Presentation.pptx"
          </p>
        </div>
      </main>
    </div>
  );
};

export default Presentation;
