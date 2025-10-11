import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, FileText, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center text-white animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
              <BookOpen className="h-12 w-12" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Autonomous Research Assistant
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-white/90">
            AI-powered paper discovery, summarization, and citation generation
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 shadow-glow"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Sign In
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-elevated animate-scale-in">
              <div className="bg-accent/20 p-3 rounded-lg w-fit mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Discovery</h3>
              <p className="text-white/80">
                Automatically find relevant research papers from multiple academic databases
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-elevated animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <div className="bg-accent/20 p-3 rounded-lg w-fit mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Summarization</h3>
              <p className="text-white/80">
                Get concise summaries and key insights extracted by advanced AI models
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-elevated animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="bg-accent/20 p-3 rounded-lg w-fit mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto Citations</h3>
              <p className="text-white/80">
                Generate formatted citations in APA, MLA, and IEEE styles instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
