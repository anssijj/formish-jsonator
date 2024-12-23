import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Highlight, themes } from "prism-react-renderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HtmlPreviewProps {
  elements: Array<{
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
    accept?: string;
  }>;
}

export const HtmlPreview = ({ elements }: HtmlPreviewProps) => {
  const generateStyledHtml = () => {
    const styles = `
<style>
  .form-group { margin-bottom: 1rem; }
  label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151; }
  input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="date"], 
  select, textarea { 
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background-color: white;
    font-size: 0.875rem;
  }
  input:focus, select:focus, textarea:focus {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
  .submit-button {
    background-color: #2563eb;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  .submit-button:hover {
    background-color: #1d4ed8;
  }
  .required { color: #ef4444; margin-left: 0.25rem; }
</style>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Form</title>
    ${styles}
</head>
<body>
    ${generateHtml()}
</body>
</html>`;
  };

  const generateHtml = () => {
    const formHtml = elements
      .map((element) => {
        const id = element.label.toLowerCase().replace(/\s+/g, "_");
        const requiredAttr = element.required ? " required" : "";
        const requiredStar = element.required ? "<span class=\"required\">*</span>" : "";
        
        switch (element.type) {
          case "file":
            return `<div class="form-group">
  <label for="${id}">${element.label}${requiredStar}</label>
  <input type="file" id="${id}" name="${id}" accept="${element.accept}"${requiredAttr}>
</div>`;

          case "select":
            return `<div class="form-group">
  <label for="${id}">${element.label}${requiredStar}</label>
  <select id="${id}" name="${id}"${requiredAttr}>
    ${(element.options || [])
      .map((opt) => `    <option value="${opt}">${opt}</option>`)
      .join("\n")}
  </select>
</div>`;

          case "radio":
            return `<div class="form-group">
  <label>${element.label}${requiredStar}</label>
  ${(element.options || [])
    .map(
      (opt) =>
        `  <div>
    <input type="radio" id="${id}_${opt}" name="${id}" value="${opt}"${requiredAttr}>
    <label for="${id}_${opt}">${opt}</label>
  </div>`
    )
    .join("\n")}
</div>`;

          case "checkbox":
            return `<div class="form-group">
  <input type="checkbox" id="${id}" name="${id}"${requiredAttr}>
  <label for="${id}">${element.label}</label>
</div>`;

          case "textarea":
            return `<div class="form-group">
  <label for="${id}">${element.label}${requiredStar}</label>
  <textarea id="${id}" name="${id}"${requiredAttr}></textarea>
</div>`;

          default:
            return `<div class="form-group">
  <label for="${id}">${element.label}${requiredStar}</label>
  <input type="${element.type}" id="${id}" name="${id}"${requiredAttr}>
</div>`;
        }
      })
      .join("\n\n");

    return `<form action="/api/submit" method="POST" enctype="multipart/form-data">\n${formHtml}\n\n  <button type="submit" class="submit-button">Submit</button>\n</form>`;
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