import { useState } from "react";
import { FormElement } from "@/components/FormBuilder/FormElement";
import { FormPreview } from "@/components/FormBuilder/FormPreview";
import { JsonPreview } from "@/components/FormBuilder/JsonPreview";
import { HtmlPreview } from "@/components/FormBuilder/HtmlPreview";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Index = () => {
  const [elements, setElements] = useState([
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

  const updateElement = (id: string, updates: any) => {
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
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Visual Form Builder
          </h1>
          <p className="text-neutral-600">
            Create beautiful forms with JSON schema support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6 animate-slide-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Form Elements
              </h2>
              <Button onClick={addElement} variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
            <div className="space-y-4">
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
            <Tabs defaultValue="preview">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button onClick={downloadJson} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Save JSON
                  </Button>
                  <Button onClick={downloadHtml} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Save HTML
                  </Button>
                </div>
              </div>
              <TabsContent value="preview">
                <FormPreview elements={elements} />
              </TabsContent>
              <TabsContent value="json">
                <JsonPreview elements={elements} />
              </TabsContent>
              <TabsContent value="html">
                <HtmlPreview elements={elements} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;