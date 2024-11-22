import { useState } from "react";
import { FormElement } from "@/components/FormBuilder/FormElement";
import { FormPreview } from "@/components/FormBuilder/FormPreview";
import { JsonPreview } from "@/components/FormBuilder/JsonPreview";
import { HtmlPreview } from "@/components/FormBuilder/HtmlPreview";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
                  onDelete={deleteElement}
                  onChange={updateElement}
                />
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <Tabs defaultValue="preview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
              </TabsList>
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