import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SelectFieldConfigProps {
  element: {
    options?: string[];
    optionValues?: string[];
  };
  onChange: (updates: any) => void;
}

export const SelectFieldConfig = ({ element, onChange }: SelectFieldConfigProps) => {
  const sanitizeValue = (value: string) => {
    return value.trim().toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
  };

  const handleOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Split by comma and handle potential whitespace around commas
    const options = inputValue.split(',').filter(Boolean).map(opt => {
      const trimmed = opt.trim();
      return {
        display: trimmed, // Keep spaces for display
        value: sanitizeValue(trimmed) // Sanitize for JSON/value
      };
    });

    onChange({
      options: options.map(opt => opt.display), // Keep original display values in the form
      optionValues: options.map(opt => opt.value) // Store sanitized values separately
    });
  };

  return (
    <div>
      <Label className="text-sm font-medium mb-2">Options</Label>
      <Input
        type="text"
        placeholder="Option 1, Option 2, Option 3"
        value={element.options?.join(', ') || ''}
        onChange={handleOptionsChange}
      />
      <p className="text-sm text-muted-foreground mt-1">
        Enter options separated by commas. Example: Red, Green, Blue
      </p>
    </div>
  );
};