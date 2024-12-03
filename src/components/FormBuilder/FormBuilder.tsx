import { useState } from "react";
import { FormElement } from "./FormElement";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

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

interface FormBuilderProps {
  elements: FormElementType[];
  onElementsChange: (elements: FormElementType[]) => void;
}

export const FormBuilder = ({ elements, onElementsChange }: FormBuilderProps) => {
  const addElement = () => {
    const newElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: "text",
      label: "New Field",
      required: false,
    };
    onElementsChange([...elements, newElement]);
  };

  const deleteElement = (id: string) => {
    onElementsChange(elements.filter((element) => element.id !== id));
  };

  const updateElement = (id: string, updates: Partial<FormElementType>) => {
    onElementsChange(
      elements.map((element) =>
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-neutral-900">Form Elements</h2>
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
  );
};