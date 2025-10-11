import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, BookmarkPlus, ChevronDown, ChevronUp } from "lucide-react";

interface PaperCardProps {
  paper: {
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
  };
  index: number;
}

const PaperCard = ({ paper, index }: PaperCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card 
      className="shadow-card hover:shadow-elevated transition-all animate-scale-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 line-clamp-2">
              {paper.title}
            </CardTitle>
            <CardDescription>
              {paper.authors.join(", ")} • {paper.year} • {paper.venue}
            </CardDescription>
          </div>
          {paper.url && (
            <Button variant="ghost" size="sm" asChild>
              <a href={paper.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2 text-primary">AI Summary</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {paper.summary}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {paper.keywords.slice(0, 5).map((keyword, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Show More
            </>
          )}
        </Button>

        {expanded && (
          <div className="space-y-4 pt-4 border-t animate-fade-in">
            <div>
              <h4 className="font-semibold text-sm mb-2">Abstract</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {paper.abstract}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Citations</h4>
              <Tabs defaultValue="apa" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="apa">APA</TabsTrigger>
                  <TabsTrigger value="mla">MLA</TabsTrigger>
                  <TabsTrigger value="ieee">IEEE</TabsTrigger>
                </TabsList>
                <TabsContent value="apa" className="mt-4">
                  <div className="bg-muted p-4 rounded-lg relative">
                    <p className="text-sm font-mono break-words">{paper.citation_apa}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(paper.citation_apa)}
                    >
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="mla" className="mt-4">
                  <div className="bg-muted p-4 rounded-lg relative">
                    <p className="text-sm font-mono break-words">{paper.citation_mla}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(paper.citation_mla)}
                    >
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="ieee" className="mt-4">
                  <div className="bg-muted p-4 rounded-lg relative">
                    <p className="text-sm font-mono break-words">{paper.citation_ieee}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(paper.citation_ieee)}
                    >
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaperCard;
