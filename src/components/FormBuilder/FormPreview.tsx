import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface FormPreviewProps {
  elements: Array<{
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
  }>;
}

export const FormPreview = ({ elements }: FormPreviewProps) => {
  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm shadow-lg animate-fade-in">
      <form className="space-y-6" action="/api/submit" method="POST">
        {elements.map((element) => {
          const id = element.label.toLowerCase().replace(/\s+/g, "_");
          
          switch (element.type) {
            case "select":
              return (
                <div key={element.id} className="space-y-2">
                  <Label htmlFor={id}>
                    {element.label}
                    {element.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <Select name={id}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${element.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {element.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );

            case "radio":
              return (
                <div key={element.id} className="space-y-2">
                  <Label>
                    {element.label}
                    {element.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <RadioGroup name={id}>
                    {element.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${id}_${option}`} />
                        <Label htmlFor={`${id}_${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              );

            case "checkbox":
              return (
                <div key={element.id} className="flex items-center space-x-2">
                  <Checkbox id={id} name={id} required={element.required} />
                  <Label htmlFor={id}>{element.label}</Label>
                </div>
              );

            case "textarea":
              return (
                <div key={element.id} className="space-y-2">
                  <Label htmlFor={id}>
                    {element.label}
                    {element.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <Textarea
                    id={id}
                    name={id}
                    placeholder={`Enter ${element.label.toLowerCase()}`}
                    required={element.required}
                  />
                </div>
              );

            default:
              return (
                <div key={element.id} className="space-y-2">
                  <Label htmlFor={id}>
                    {element.label}
                    {element.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <Input
                    type={element.type}
                    id={id}
                    name={id}
                    placeholder={`Enter ${element.label.toLowerCase()}`}
                    required={element.required}
                  />
                </div>
              );
          }
        })}
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </Card>
  );
};