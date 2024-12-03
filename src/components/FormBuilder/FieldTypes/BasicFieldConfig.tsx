import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface BasicFieldConfigProps {
  element: {
    id: string;
    label: string;
    required: boolean;
    placeholder?: string;
  };
  onChange: (updates: any) => void;
}

export const BasicFieldConfig = ({ element, onChange }: BasicFieldConfigProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-2">Field Label</Label>
        <Input
          type="text"
          value={element.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Enter label"
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-2">Placeholder Text</Label>
        <Input
          type="text"
          value={element.placeholder || ""}
          onChange={(e) => onChange({ placeholder: e.target.value })}
          placeholder="Enter placeholder text"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id={`required-${element.id}`}
          checked={element.required}
          onCheckedChange={(checked) => onChange({ required: checked })}
        />
        <Label htmlFor={`required-${element.id}`}>Required field</Label>
      </div>
    </div>
  );
};