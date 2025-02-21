
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
    optionValues?: string[];
    accept?: string;
    showWhen?: {
      field: string;
      value: string;
    };
  }>;
}

export const HtmlPreview = ({ elements }: HtmlPreviewProps) => {
  const sanitizeValue = (value: string) => {
    return value.trim().toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
  };

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
  .hidden { display: none !important; }
</style>`;

    const conditionalFields = elements.filter(el => el.showWhen);
    const script = conditionalFields.length > 0 ? `
<script>
document.addEventListener('DOMContentLoaded', function() {
  const formValues = {};
  
  function updateVisibility() {
    ${conditionalFields.map(element => `
    // Conditional display for ${element.label}
    {
      const field = document.getElementById('${element.id}').closest('.form-group');
      const controllingField = document.getElementById('${element.showWhen?.field}');
      const shouldShow = controllingField.value === '${element.showWhen?.value}';
      field.classList.toggle('hidden', !shouldShow);
    }`).join('\n')}
  }

  // Add change event listeners to all controlling fields
  ${[...new Set(conditionalFields.map(el => el.showWhen?.field))].map(fieldId => `
  document.getElementById('${fieldId}')?.addEventListener('change', function(e) {
    formValues['${fieldId}'] = e.target.value;
    updateVisibility();
  });`).join('\n')}

  // Initial visibility check
  updateVisibility();
});
</script>` : '';

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
    ${script}
</body>
</html>`;
  };

  const generateHtml = () => {
    const formHtml = elements
      .map((element) => {
        const id = element.id;
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
      .map((opt, index) => {
        const value = element.optionValues?.[index] || sanitizeValue(opt);
        return `    <option value="${value}">${opt}</option>`;
      })
      .join("\n")}
  </select>
</div>`;

          case "radio":
            return `<div class="form-group">
  <label>${element.label}${requiredStar}</label>
  ${(element.options || [])
    .map((opt, index) => {
      const value = element.optionValues?.[index] || sanitizeValue(opt);
      return `  <div>
    <input type="radio" id="${id}_${value}" name="${id}" value="${value}"${requiredAttr}>
    <label for="${id}_${value}">${opt}</label>
  </div>`;
    })
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
