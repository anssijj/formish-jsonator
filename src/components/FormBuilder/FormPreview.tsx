import { Card } from "@/components/ui/card";

interface FormPreviewProps {
  elements: Array<{
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
  }>;
}

export const FormPreview = ({ elements }: FormPreviewProps) => {
  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm shadow-lg animate-fade-in">
      <form className="space-y-6">
        {elements.map((element) => (
          <div key={element.id} className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {element.label}
              {element.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </label>
            <input
              type={element.type}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={`Enter ${element.label.toLowerCase()}`}
            />
          </div>
        ))}
      </form>
    </Card>
  );
};