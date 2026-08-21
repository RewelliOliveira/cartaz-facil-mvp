import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

export function ColorPicker({ color, onChange, disabled }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        disabled={disabled}
        className="h-10 w-10 rounded-md border-2 border-white p-1 shadow-sm ring-1 ring-border transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-50"
        style={{ backgroundColor: color }}
        aria-label="Alterar cor do texto"
        title="Alterar cor do texto"
      />
      <PopoverContent className="w-auto p-3 flex flex-col gap-3">
        <HexColorPicker color={color} onChange={onChange} />

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            HEX
          </span>
          <Input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 text-xs uppercase"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
