import { useState } from "react";
import { FormElement } from "@/components/FormBuilder/FormElement";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Header } from "@/components/FormBuilder/Header";
import { PreviewTabs } from "@/components/FormBuilder/PreviewTabs";
import { toast } from "sonner";

interface FormElementType {
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
}

const Index = () => {
  const [elements, setElements] = useState<FormElementType[]>([
    {
      id: "1",
      type: "text",
      label: "Full Name",
      required: true,
    },
  ]);

  const addElement = () => {
    const newElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: "text",
      label: "New Field",
      required: false,
    };
    setElements([...elements, newElement]);
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter((element) => element.id !== id));
  };

  const updateElement = (id: string, updates: Partial<FormElementType>) => {
    setElements(
      elements.map((element) =>
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  const downloadJson = () => {
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

    const blob = new Blob([JSON.stringify(jsonSchema, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-schema.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("JSON schema downloaded successfully");
  };

  const downloadHtml = () => {
    const formHtml = elements
      .map((element) => {
        const id = element.label.toLowerCase().replace(/\s+/g, "_");
        const requiredAttr = element.required ? " required" : "";
        
        switch (element.type) {
          case "file":
            return `<div class="form-group">
  <label for="${id}">${element.label}${element.required ? " *" : ""}</label>
  <input type="file" id="${id}" name="${id}" accept="${element.accept}"${requiredAttr}>
</div>`;

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

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Form</title>
    <style>
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; }
        input, select, textarea { 
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .submit-button {
            background-color: #2563eb;
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .submit-button:hover {
            background-color: #1d4ed8;
        }
    </style>
</head>
<body>
    <form action="/api/submit" method="POST" enctype="multipart/form-data">
${formHtml}

        <button type="submit" class="submit-button">Submit</button>
    </form>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("HTML file downloaded successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-8">
      <div className="max-w-7xl mx-auto">
        <Header onDownloadJson={downloadJson} onDownloadHtml={downloadHtml} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6 animate-slide-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Form Elements
              </h2>
              <Button 
                onClick={addElement} 
                variant="outline" 
                size="sm"
                className="hover:scale-105 transition-transform"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
            <div className="space-y-4 glass-morphism rounded-lg p-6">
              {elements.map((element) => (
                <FormElement
                  key={element.id}
                  element={element}
                  elements={elements}
                  onDelete={deleteElement}
                  onChange={updateElement}
                />
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <PreviewTabs elements={elements} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;