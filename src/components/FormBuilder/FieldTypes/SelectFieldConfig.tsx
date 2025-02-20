
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface SelectFieldConfigProps {
  element: {
    options?: string[];
    optionValues?: string[];
  };
  onChange: (updates: any) => void;
}

export const SelectFieldConfig = ({ element, onChange }: SelectFieldConfigProps) => {
  const [newOption, setNewOption] = useState("");

  const sanitizeValue = (value: string) => {
    return value.trim().toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
  };

  const handleAddOption = () => {
    if (!newOption.trim()) return;

    const trimmedOption = newOption.trim();
    const updatedOptions = [...(element.options || []), trimmedOption];
    const updatedOptionValues = [...(element.optionValues || []), sanitizeValue(trimmedOption)];

    onChange({
      options: updatedOptions,
      optionValues: updatedOptionValues
    });

    setNewOption("");
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = (element.options || []).filter((_, i) => i !== index);
    const updatedOptionValues = (element.optionValues || []).filter((_, i) => i !== index);

    onChange({
      options: updatedOptions,
      optionValues: updatedOptionValues
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Options</Label>
      
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add an option"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button 
          type="button"
          variant="outline"
          onClick={handleAddOption}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {element.options?.map((option, index) => (
          <div key={index} className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
            <span className="flex-1">{option}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveOption(index)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {(element.options?.length === 0 || !element.options) && (
        <p className="text-sm text-muted-foreground">
          No options added yet. Add some options above.
        </p>
      )}
    </div>
  );
};
