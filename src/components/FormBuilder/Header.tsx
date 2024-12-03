import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface HeaderProps {
  onDownloadJson: () => void;
  onDownloadHtml: () => void;
}

export const Header = ({ onDownloadJson, onDownloadHtml }: HeaderProps) => {
  return (
    <div className="text-center mb-12 animate-fade-in">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Visual Form Builder
      </h1>
      <p className="text-neutral-600 mb-6">
        Create beautiful forms with JSON schema support
      </p>
      <div className="flex justify-center gap-4">
        <Button onClick={onDownloadJson} variant="outline" size="sm" className="hover:scale-105 transition-transform">
          <Download className="h-4 w-4 mr-2" />
          Save JSON
        </Button>
        <Button onClick={onDownloadHtml} variant="outline" size="sm" className="hover:scale-105 transition-transform">
          <Download className="h-4 w-4 mr-2" />
          Save HTML
        </Button>
      </div>
    </div>
  );
};