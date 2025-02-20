
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
    placeholder?: string;
    options?: string[];
    optionValues?: string[];
    accept?: string;
    showWhen?: {
      field: string;
      value: string;
    };
    recaptchaSiteKey?: string;
    description?: string;
    errorMessage?: string;
  }>;
}

export const FormPreview = ({ elements }: FormPreviewProps) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: false }));
  };

  const handleRecaptchaChange = (id: string, value: string | null) => {
    setValues((prev) => ({ ...prev, [id]: value || "" }));
  };

  const shouldShowField = (element: FormPreviewProps["elements"][0]) => {
    if (!element.showWhen) return true;
    
    // Get the controlling field's current value
    const controllingFieldValue = values[element.showWhen.field];
    
    // Show the field if the controlling field's value matches the condition
    return controllingFieldValue === element.showWhen.value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    const newErrors: Record<string, boolean> = {};
    elements.forEach((element) => {
      if (element.required && !values[element.id]) {
        newErrors[element.id] = true;
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Form is valid, proceed with submission
      console.log('Form submitted:', values);
    }
  };

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm shadow-lg animate-fade-in">
      <form 
        onSubmit={handleSubmit}
        className="space-y-6" 
        noValidate
        role="form"
        aria-label="Contact form"
      >
        {elements.map((element) => {
          if (!shouldShowField(element)) return null;
          
          const id = element.label.toLowerCase().replace(/\s+/g, "_");
          const isError = errors[element.id];
          const ariaDescribedBy = `${id}-description${isError ? ` ${id}-error` : ''}`;
          
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
                <div key={element.id} className="text-red-500 text-center" role="alert">
                  Please configure reCAPTCHA site key in the form builder
                </div>
              );

            case "file":
              return (
                <div key={element.id} className="space-y-2">
                  <Label htmlFor={id}>
                    {element.label}
                    {element.required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
                  </Label>
                  <Input
                    type="file"
                    id={id}
                    name={id}
                    accept={element.accept}
                    required={element.required}
                    className="cursor-pointer"
                    aria-required={element.required}
                    aria-invalid={isError}
                    aria-describedby={ariaDescribedBy}
                  />
                  {element.description && (
                    <p id={`${id}-description`} className="text-sm text-muted-foreground">
                      {element.description}
                    </p>
                  )}
                  {isError && (
                    <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
                      {element.errorMessage || 'This field is required'}
                    </p>
                  )}
                </div>
              );

            case "select":
              return (
                <div key={element.id} className="space-y-2">
                  <Label htmlFor={id}>
                    {element.label}
                    {element.required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
                  </Label>
                  <Select 
                    name={id}
                    onValueChange={(value) => handleChange(element.id, value)}
                    value={values[element.id]}
                  >
                    <SelectTrigger
                      aria-required={element.required}
                      aria-invalid={isError}
                      aria-describedby={ariaDescribedBy}
                    >
                      <SelectValue placeholder={element.placeholder || `Select ${element.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {element.options?.filter(Boolean).map((option, index) => (
                        <SelectItem 
                          key={option} 
                          value={element.optionValues?.[index] || option}
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {element.description && (
                    <p id={`${id}-description`} className="text-sm text-muted-foreground">
                      {element.description}
                    </p>
                  )}
                  {isError && (
                    <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
                      {element.errorMessage || 'Please select an option'}
                    </p>
                  )}
                </div>
              );

            case "radio":
              return (
                <div key={element.id} className="space-y-2">
                  <Label>
                    {element.label}
                    {element.required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
                  </Label>
                  <RadioGroup 
                    name={id}
                    value={values[element.id]}
                    onValueChange={(value) => handleChange(element.id, value)}
                    aria-required={element.required}
                    aria-invalid={isError}
                    aria-describedby={ariaDescribedBy}
                  >
                    {element.options?.filter(Boolean).map((option, index) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={element.optionValues?.[index] || option} 
                          id={`${id}_${option}`}
                        />
                        <Label htmlFor={`${id}_${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {element.description && (
                    <p id={`${id}-description`} className="text-sm text-muted-foreground">
                      {element.description}
                    </p>
                  )}
                  {isError && (
                    <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
                      {element.errorMessage || 'Please select an option'}
                    </p>
                  )}
                </div>
              );

            case "checkbox":
              return (
                <div key={element.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={id} 
                    name={id}
                    checked={values[element.id] === "true"}
                    onCheckedChange={(checked) => 
                      handleChange(element.id, checked ? "true" : "false")
                    }
                    required={element.required}
                    aria-required={element.required}
                    aria-invalid={isError}
                    aria-describedby={ariaDescribedBy}
                  />
                  <Label htmlFor={id}>{element.label}</Label>
                  {element.description && (
                    <p id={`${id}-description`} className="text-sm text-muted-foreground">
                      {element.description}
                    </p>
                  )}
                  {isError && (
                    <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
                      {element.errorMessage || 'This field is required'}
                    </p>
                  )}
                </div>
              );

            case "textarea":
              return (
                <div key={element.id} className="space-y-2">
                  <Label htmlFor={id}>
                    {element.label}
                    {element.required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
                  </Label>
                  <Textarea
                    id={id}
                    name={id}
                    value={values[element.id] || ""}
                    onChange={(e) => handleChange(element.id, e.target.value)}
                    placeholder={element.placeholder || `Enter ${element.label.toLowerCase()}`}
                    required={element.required}
                    aria-required={element.required}
                    aria-invalid={isError}
                    aria-describedby={ariaDescribedBy}
                  />
                  {element.description && (
                    <p id={`${id}-description`} className="text-sm text-muted-foreground">
                      {element.description}
                    </p>
                  )}
                  {isError && (
                    <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
                      {element.errorMessage || 'This field is required'}
                    </p>
                  )}
                </div>
              );

            default:
              return (
                <div key={element.id} className="space-y-2">
                  <Label htmlFor={id}>
                    {element.label}
                    {element.required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
                  </Label>
                  <Input
                    type={element.type}
                    id={id}
                    name={id}
                    value={values[element.id] || ""}
                    onChange={(e) => handleChange(element.id, e.target.value)}
                    placeholder={element.placeholder || `Enter ${element.label.toLowerCase()}`}
                    required={element.required}
                    aria-required={element.required}
                    aria-invalid={isError}
                    aria-describedby={ariaDescribedBy}
                  />
                  {element.description && (
                    <p id={`${id}-description`} className="text-sm text-muted-foreground">
                      {element.description}
                    </p>
                  )}
                  {isError && (
                    <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
                      {element.errorMessage || 'This field is required'}
                    </p>
                  )}
                </div>
              );
          }
        })}
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </Card>
  );
};
