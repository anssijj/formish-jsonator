import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JsonPreviewProps {
  elements: Array<{
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
  }>;
}

export const JsonPreview = ({ elements }: JsonPreviewProps) => {
  const jsonSchema = elements.map((element) => {
    const fieldName = element.label.toLowerCase().replace(/\s+/g, "_");
    return {
      data: {
        targetVariables: fieldName
      },
      path: `details.${fieldName}`,
      type: element.type === "number" ? "number" : "string"
    };
  });

  return (
    <Card className="p-4 bg-neutral-900 text-neutral-50">
      <ScrollArea className="h-[400px]">
        <pre className="text-sm font-mono">
          {JSON.stringify(jsonSchema, null, 2)}
        </pre>
      </ScrollArea>
    </Card>
  );
};