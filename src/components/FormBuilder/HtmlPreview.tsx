
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Highlight, themes } from "prism-react-renderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateElementHtml } from "./utils/htmlGeneratorUtils";
import { generateStyles } from "./components/StylesGenerator";
import { generateConditionalScript } from "./components/ConditionalScriptGenerator";

interface HtmlPreviewProps {
  elements: Array<{
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
    optionValues?: string[];
    accept?: string;
    showWhen?: {
      field: string;
      value: string;
    };
  }>;
}

export const HtmlPreview = ({ elements }: HtmlPreviewProps) => {
  const generateHtml = () => {
    const formHtml = elements
      .map((element) => generateElementHtml(element))
      .join("\n\n");

    return `<form action="/api/submit" method="POST" enctype="multipart/form-data">\n${formHtml}\n\n  <button type="submit" class="submit-button">Submit</button>\n</form>`;
  };

  const generateStyledHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Form</title>
    ${generateStyles()}
</head>
<body>
    ${generateHtml()}
    ${generateConditionalScript(elements)}
</body>
</html>`;
  };

  return (
    <Card className="p-4 bg-neutral-900 text-neutral-50">
      <Tabs defaultValue="styled">
        <TabsList className="mb-4">
          <TabsTrigger value="styled">Styled HTML</TabsTrigger>
          <TabsTrigger value="plain">Plain HTML</TabsTrigger>
        </TabsList>
        <TabsContent value="styled">
          <ScrollArea className="h-[400px]">
            <Highlight
              theme={themes.nightOwl}
              code={generateStyledHtml()}
              language="html"
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
        </TabsContent>
        <TabsContent value="plain">
          <ScrollArea className="h-[400px]">
            <Highlight
              theme={themes.nightOwl}
              code={generateHtml()}
              language="html"
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
        </TabsContent>
      </Tabs>
    </Card>
  );
};

