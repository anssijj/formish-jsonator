import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BasicFieldConfig } from "./FieldTypes/BasicFieldConfig";
import { SelectFieldConfig } from "./FieldTypes/SelectFieldConfig";
import { FileFieldConfig } from "./FieldTypes/FileFieldConfig";

interface FormElementType {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  accept?: string;
  showWhen?: {
    field: string;
    value: string;
  };
  recaptchaSiteKey?: string;
}

interface FormElementProps {
  element: FormElementType;
  elements: FormElementType[];
  onDelete: (id: string) => void;
  onChange: (id: string, updates: any) => void;
}

export const FormElement = ({ element, elements, onDelete, onChange }: FormElementProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (updates: Partial<FormElementType>) => {
    onChange(element.id, { ...element, ...updates });
  };

  const dropdownFields = elements.filter(
    (el) => el.type === "select" && el.id !== element.id
  );

  return (
    <Card
      className="p-4 mb-4 relative transition-all duration-200 hover:shadow-lg animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-4">
          <BasicFieldConfig element={element} onChange={handleChange} />
          
          <div>
            <Label className="text-sm font-medium mb-2">Field Type</Label>
            <Select
              value={element.type}
              onValueChange={(value) => handleChange({ type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Input</SelectItem>
                <SelectItem value="number">Number Input</SelectItem>
                <SelectItem value="email">Email Input</SelectItem>
                <SelectItem value="tel">Phone Input</SelectItem>
                <SelectItem value="date">Date Input</SelectItem>
                <SelectItem value="select">Dropdown</SelectItem>
                <SelectItem value="radio">Radio Buttons</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="textarea">Text Area</SelectItem>
                <SelectItem value="file">File Upload</SelectItem>
                <SelectItem value="recaptcha">reCAPTCHA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(element.type === "select" || element.type === "radio") && (
            <SelectFieldConfig element={element} onChange={handleChange} />
          )}

          {element.type === "file" && (
            <FileFieldConfig element={element} onChange={handleChange} />
          )}

          {dropdownFields.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Show When</Label>
              <Select
                value={element.showWhen?.field || "none"}
                onValueChange={(value) =>
                  handleChange({
                    showWhen: value !== "none" ? { field: value, value: "" } : undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Always show" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Always show</SelectItem>
                  {dropdownFields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {element.showWhen?.field && (
                <div>
                  <Label className="text-sm font-medium">When Value Is</Label>
                  <Select
                    value={element.showWhen.value || "select_value"}
                    onValueChange={(value) =>
                      handleChange({
                        showWhen: { ...element.showWhen, value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select value" />
                    </SelectTrigger>
                    <SelectContent>
                      {elements
                        .find((el) => el.id === element.showWhen?.field)
                        ?.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className={`transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => onDelete(element.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
};