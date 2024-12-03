import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface FormElementType {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  accept?: string;
}

interface ImportHtmlFormProps {
  onImport: (elements: FormElementType[]) => void;
}

export const ImportHtmlForm = ({ onImport }: ImportHtmlFormProps) => {
  const [htmlInput, setHtmlInput] = useState("");

  const parseHtmlForm = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const form = doc.querySelector("form");
    
    if (!form) {
      toast.error("No form element found in the HTML");
      return;
    }

    const elements: FormElementType[] = [];
    const formElements = form.querySelectorAll("input, select, textarea");

    formElements.forEach((element) => {
      const label = element.getAttribute("aria-label") || 
                   form.querySelector(`label[for="${element.id}"]`)?.textContent || 
                   "Untitled Field";

      if (element instanceof HTMLSelectElement) {
        const options = Array.from(element.options).map(opt => opt.text);
        elements.push({
          id: Math.random().toString(36).substr(2, 9),
          type: "select",
          label: label.trim(),
          required: element.required,
          options
        });
      } else if (element instanceof HTMLTextAreaElement) {
        elements.push({
          id: Math.random().toString(36).substr(2, 9),
          type: "textarea",
          label: label.trim(),
          required: element.required
        });
      } else if (element instanceof HTMLInputElement) {
        const type = element.type === "tel" ? "tel" :
                    element.type === "email" ? "email" :
                    element.type === "number" ? "number" :
                    element.type === "date" ? "date" :
                    element.type === "file" ? "file" :
                    element.type === "radio" ? "radio" :
                    element.type === "checkbox" ? "checkbox" : "text";

        if (type === "radio") {
          // Group radio buttons
          const name = element.name;
          const existingGroup = elements.find(el => el.type === "radio" && el.label === label);
          if (existingGroup) {
            existingGroup.options = [...(existingGroup.options || []), element.value];
          } else {
            elements.push({
              id: Math.random().toString(36).substr(2, 9),
              type,
              label: label.trim(),
              required: element.required,
              options: [element.value]
            });
          }
        } else {
          elements.push({
            id: Math.random().toString(36).substr(2, 9),
            type,
            label: label.trim(),
            required: element.required,
            ...(type === "file" && element.accept ? { accept: element.accept } : {})
          });
        }
      }
    });

    return elements;
  };

  const handleImport = () => {
    try {
      const elements = parseHtmlForm(htmlInput);
      if (elements && elements.length > 0) {
        onImport(elements);
        setHtmlInput("");
        toast.success("Form imported successfully");
      }
    } catch (error) {
      toast.error("Failed to parse HTML form");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={htmlInput}
        onChange={(e) => setHtmlInput(e.target.value)}
        placeholder="Paste your HTML form code here..."
        className="min-h-[200px] font-mono text-sm"
      />
      <Button 
        onClick={handleImport}
        disabled={!htmlInput.trim()}
        className="w-full"
      >
        Import HTML Form
      </Button>
    </div>
  );
};