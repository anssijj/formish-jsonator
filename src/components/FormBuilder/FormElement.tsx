import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface FormElementProps {
  element: {
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
  };
  onDelete: (id: string) => void;
  onChange: (id: string, updates: any) => void;
}

export const FormElement = ({ element, onDelete, onChange }: FormElementProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="p-4 mb-4 relative transition-all duration-200 hover:shadow-lg animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Label className="text-sm font-medium mb-2">{element.label}</Label>
          <Input
            type="text"
            value={element.label}
            onChange={(e) =>
              onChange(element.id, { ...element, label: e.target.value })
            }
            className="mb-2"
            placeholder="Enter label"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => onDelete(element.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
};