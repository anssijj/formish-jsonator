import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";

interface FormPreviewProps {
  elements: Array<{
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
  }>;
}

export const FormPreview = ({ elements }: FormPreviewProps) => {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleRecaptchaChange = (id: string, value: string | null) => {
    setValues((prev) => ({ ...prev, [id]: value || "" }));
  };

  const shouldShowField = (element: FormPreviewProps["elements"][0]) => {
    if (!element.showWhen) return true;
    return values[element.showWhen.field] === element.showWhen.value;
  };

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm shadow-lg animate-fade-in">
      <form className="space-y-6" action="/api/submit" method="POST" encType="multipart/form-data">
        {elements.map((element) => {
          if (!shouldShowField(element)) return null;
          
          const id = element.label.toLowerCase().replace(/\s+/g, "_");
          
          switch (element.type) {
            case "recaptcha":
              return element.recaptchaSiteKey ? (
                <div key={element.id} className="flex justify-center">
                  <ReCAPTCHA
                    sitekey={element.recaptchaSiteKey}
                    onChange={(value) => handleRecaptchaChange(element.id, value)}
                  />
                </div>
              ) : (
                <div key={element.id} className="text-red-500 text-center">
                  Please configure reCAPTCHA site key in the form builder
                </div>
              );

            case "file":
              return (
                <div key={element.id} className="space-y-2">
                  <Label htmlFor={id}>
                    {element.label}
                    {element.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <Input
                    type="file"
                    id={id}
                    name={id}
                    accept={element.accept}
                    required={element.required}
                    className="cursor-pointer"
                  />
                </div>
              );

            case "select":
              return (
                <div key={element.id} className="space-y-2">
                  <Label htmlFor={id}>
                    {element.label}
                    {element.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <Select 
                    name={id}
                    onValueChange={(value) => handleChange(element.id, value)}
                    value={values[element.id] || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={element.placeholder || `Select ${element.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {element.options?.filter(Boolean).map((option) => (
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
                    {element.options?.filter(Boolean).map((option) => (
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
                    placeholder={element.placeholder || `Enter ${element.label.toLowerCase()}`}
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
                    placeholder={element.placeholder || `Enter ${element.label.toLowerCase()}`}
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
