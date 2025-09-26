import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Highlight, themes } from "prism-react-renderer";

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
    const fieldName = element.label.trim().toLowerCase().replace(/[^a-zA-Z0-9\s_-]/g, '').replace(/\s+/g, "_");
    return {
      data: {
        targetVariables: fieldName
      },
      path: `details.${fieldName}`,
      type: element.type === "number" ? "number" : "string"
    };
  });

  const jsonString = JSON.stringify(jsonSchema, null, 2);

  return (
    <Card className="p-4 bg-neutral-900 text-neutral-50">
      <ScrollArea className="h-[400px]">
        <Highlight
          theme={themes.nightOwl}
          code={jsonString}
          language="json"
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={{ ...style, background: 'transparent' }}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </ScrollArea>
    </Card>
  );
};