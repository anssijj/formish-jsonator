import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SelectFieldConfigProps {
  element: {
    options?: string[];
  };
  onChange: (updates: any) => void;
}

export const SelectFieldConfig = ({ element, onChange }: SelectFieldConfigProps) => {
  return (
    <div>
      <Label className="text-sm font-medium mb-2">Options</Label>
      <Input
        type="text"
        placeholder="Comma-separated options"
        value={element.options?.join(", ") || ""}
        onChange={(e) =>
          onChange({
            options: e.target.value.split(",").map((opt) => opt.trim()),
          })
        }
      />
    </div>
  );
};