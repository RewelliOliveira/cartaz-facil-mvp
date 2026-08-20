import { Bold, Italic, Underline } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type TextStyleState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

interface ToggleGroupDemoProps {
  value: TextStyleState;
  onChange: (value: TextStyleState) => void;
}

export function ToggleGroupDemo({ value, onChange }: ToggleGroupDemoProps) {
  const activeValues = [
    value.bold ? "bold" : "",
    value.italic ? "italic" : "",
    value.underline ? "underline" : "",
  ].filter(Boolean);

  return (
    <ToggleGroup
      variant="outline"
      multiple
      value={activeValues}
      onValueChange={(nextValues) => {
        onChange({
          bold: nextValues.includes("bold"),
          italic: nextValues.includes("italic"),
          underline: nextValues.includes("underline"),
        });
      }}
    >
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
