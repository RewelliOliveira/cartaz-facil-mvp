import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LAYOUT_SIZES, type LayoutSize } from "@/config/layout-size";

interface LayoutSizeSelectProps {
  currentSize: LayoutSize;
  onChange: (size: LayoutSize) => void;
  disabled?: boolean;
}

export function LayoutSizeSelect({
  currentSize,
  onChange,
  disabled,
}: LayoutSizeSelectProps) {
  const handleSizeChange = (id: string) => {
    const newSize = LAYOUT_SIZES.find((size) => size.id === id);
    if (newSize) {
      onChange(newSize);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 font-medium">Page Size:</span>
      <Select
        value={currentSize.id}
        disabled={disabled}
        onValueChange={(id) => {
          if (id) handleSizeChange(id);
        }}
      >
        <SelectTrigger className="w-55" disabled={disabled}>
          <SelectValue placeholder="Select page size" />
        </SelectTrigger>
        <SelectContent>
          {LAYOUT_SIZES.map((size) => (
            <SelectItem key={size.id} value={size.id}>
              {size.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
