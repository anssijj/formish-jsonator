import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SelectFieldConfigProps {
  element: {
    options?: string[];
  };
  onChange: (updates: any) => void;
}

export const SelectFieldConfig = ({ element, onChange }: SelectFieldConfigProps) => {
  const sanitizeValue = (value: string) => {
    // Remove special characters and replace spaces with underscores for JSON
    return value.trim().toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
  };

  const handleOptionsChange = (value: string) => {
    const options = value.split(",").map(opt => {
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
        placeholder="Comma-separated options"
        value={element.options?.join(", ") || ""}
        onChange={(e) => handleOptionsChange(e.target.value)}
      />
      <p className="text-sm text-muted-foreground mt-1">
        Enter options separated by commas. Spaces are allowed.
      </p>
    </div>
  );
};