import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface FontSizePickerProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function FontSizePicker({
  value,
  min = 1,
  max = 200,
  onChange,
}: FontSizePickerProps) {
  const updateValue = (newValue: number) => {
    const clampedValue = Math.min(Math.max(newValue, min), max);
    onChange(clampedValue);
  };

  return (
    <div className="flex items-center gap-1 border rounded-md p-1 w-fit bg-background">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => updateValue(value - 1)}
        disabled={value <= min}
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>

      <Input
        type="number"
        value={value}
        onChange={(e) => updateValue(Number(e.target.value))}
        className="h-7 w-12 text-center p-0 border-none shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => updateValue(value + 1)}
        disabled={value >= max}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
