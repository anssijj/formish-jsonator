import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FileFieldConfigProps {
  element: {
    accept?: string;
  };
  onChange: (updates: any) => void;
}

export const FileFieldConfig = ({ element, onChange }: FileFieldConfigProps) => {
  return (
    <div>
      <Label className="text-sm font-medium mb-2">Accepted File Types</Label>
      <Select
        value={element.accept || "documents"}
        onValueChange={(value) => onChange({ accept: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select accepted file types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="documents">.pdf,.doc,.docx</SelectItem>
          <SelectItem value="images">image/*</SelectItem>
          <SelectItem value="all">.pdf,.doc,.docx,image/*</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};