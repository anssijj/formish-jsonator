import { useState } from "react";
import { FormElement } from "./FormElement";
import { ImportHtmlForm } from "./ImportHtmlForm";
import { Button } from "@/components/ui/button";
import { PlusCircle, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormPreview } from "./FormPreview";

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
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

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

  const handleImport = (importedElements: FormElementType[]) => {
    onElementsChange([...elements, ...importedElements]);
    setImportDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-neutral-900">Form Elements</h2>
        <div className="flex gap-2">
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Import HTML
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import HTML Form</DialogTitle>
              </DialogHeader>
              <ImportHtmlForm onImport={handleImport} />
            </DialogContent>
          </Dialog>

          <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview Form
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Form Preview</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <FormPreview elements={elements} />
              </div>
            </DialogContent>
          </Dialog>

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