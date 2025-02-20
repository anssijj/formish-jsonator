
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
    
    // Allow typing commas by not filtering empty strings immediately
    const options = inputValue.split(',').map(opt => {
      const trimmed = opt.trim();
      return {
        display: trimmed,
        value: trimmed ? sanitizeValue(trimmed) : ''
      };
    });

    // Only filter out empty strings when updating the form state
    const filteredOptions = options.filter(opt => opt.display);

    onChange({
      options: filteredOptions.map(opt => opt.display),
      optionValues: filteredOptions.map(opt => opt.value)
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
