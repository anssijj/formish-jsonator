import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HtmlPreviewProps {
  elements: Array<{
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
  }>;
}

export const HtmlPreview = ({ elements }: HtmlPreviewProps) => {
  const generateHtml = () => {
    const formHtml = elements
      .map((element) => {
        const id = element.label.toLowerCase().replace(/\s+/g, "_");
        const requiredAttr = element.required ? " required" : "";
        
        switch (element.type) {
          case "select":
            return `<div class="form-group">
  <label for="${id}">${element.label}${element.required ? " *" : ""}</label>
  <select id="${id}" name="${id}"${requiredAttr}>
    ${(element.options || [])
      .map((opt) => `    <option value="${opt}">${opt}</option>`)
      .join("\n")}
  </select>
</div>`;

          case "radio":
            return `<div class="form-group">
  <label>${element.label}${element.required ? " *" : ""}</label>
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
  <label for="${id}">${element.label}${element.required ? " *" : ""}</label>
  <textarea id="${id}" name="${id}"${requiredAttr}></textarea>
</div>`;

          default:
            return `<div class="form-group">
  <label for="${id}">${element.label}${element.required ? " *" : ""}</label>
  <input type="${element.type}" id="${id}" name="${id}"${requiredAttr}>
</div>`;
        }
      })
      .join("\n\n");

    return `<form action="/api/submit" method="POST">\n${formHtml}\n\n  <button type="submit" class="submit-button">Submit</button>\n</form>`;
  };

  return (
    <Card className="p-4 bg-neutral-900 text-neutral-50">
      <ScrollArea className="h-[400px]">
        <pre className="text-sm font-mono whitespace-pre-wrap">
          {generateHtml()}
        </pre>
      </ScrollArea>
    </Card>
  );
};