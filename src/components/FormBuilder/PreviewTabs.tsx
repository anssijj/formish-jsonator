import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormPreview } from "./FormPreview";
import { JsonPreview } from "./JsonPreview";
import { HtmlPreview } from "./HtmlPreview";

interface PreviewTabsProps {
  elements: Array<{
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
    accept?: string;
    showWhen?: {
      field: string;
      value: string;
    };
    recaptchaSiteKey?: string;
  }>;
}

export const PreviewTabs = ({ elements }: PreviewTabsProps) => {
  return (
    <Tabs defaultValue="preview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="preview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Preview
        </TabsTrigger>
        <TabsTrigger value="json" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          JSON
        </TabsTrigger>
        <TabsTrigger value="html" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          HTML
        </TabsTrigger>
      </TabsList>
      <div className="relative">
        <TabsContent value="preview" className="mt-0 animate-fade-in">
          <FormPreview elements={elements} />
        </TabsContent>
        <TabsContent value="json" className="mt-0 animate-fade-in">
          <JsonPreview elements={elements} />
        </TabsContent>
        <TabsContent value="html" className="mt-0 animate-fade-in">
          <HtmlPreview elements={elements} />
        </TabsContent>
      </div>
    </Tabs>
  );
};