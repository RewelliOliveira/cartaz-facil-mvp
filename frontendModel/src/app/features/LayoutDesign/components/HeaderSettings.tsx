import { FontSizePicker } from "@/components/FontSizePicker";
import { FontSizeSelect } from "@/components/FontSizeSelect";
import { LayoutSizeSelect } from "@/components/LayoutSizeSelect";
import {
  ToggleGroupDemo,
  type TextStyleState,
} from "@/components/ToggleGroupDemo";
import { ColorPicker } from "@/components/ColorPicker";
import { PrintService } from "./PrintService";
import { LAYOUT_SIZES, type LayoutSize } from "@/config/layout-size";
import type { CanvasTextElement } from "@/types/canvas";

interface LayoutSettingsProps {
  currentSize?: LayoutSize;
  onSizeChange?: (size: LayoutSize) => void;
  selectedElement?: CanvasTextElement | null;
  onFontFamilyChange?: (fontFamily: string) => void;
  onFontSizeChange?: (fontSize: number) => void;
  onColorChange?: (color: string) => void;
  textStyle?: TextStyleState;
  onTextStyleChange?: (style: TextStyleState) => void;
  elements?: CanvasTextElement[];
  disabled?: boolean;
}

export function HeaderSettings({
  currentSize = LAYOUT_SIZES[0],
  onSizeChange = () => {},
  selectedElement = null,
  onFontFamilyChange = () => {},
  onFontSizeChange = () => {},
  onColorChange = () => {},
  textStyle = { bold: false, italic: false, underline: false },
  onTextStyleChange = () => {},
  elements = [],
  disabled = true,
}: LayoutSettingsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-orange-300 p-2">
      <FontSizeSelect
        value={selectedElement?.fontFamily ?? "Montserrat"}
        onChange={onFontFamilyChange}
        disabled={disabled}
      />
      <FontSizePicker
        value={selectedElement?.fontSize ?? 16}
        onChange={onFontSizeChange}
        disabled={disabled}
      />
      <ColorPicker
        color={selectedElement?.fill ?? "#111827"}
        onChange={onColorChange}
        disabled={disabled}
      />
      <ToggleGroupDemo
        value={textStyle}
        onChange={onTextStyleChange}
        disabled={disabled}
      />
      <LayoutSizeSelect
        currentSize={currentSize}
        onChange={onSizeChange}
        disabled={disabled}
      />
      <PrintService
        layoutSize={currentSize}
        elements={elements}
        disabled={disabled}
      />
    </div>
  );
}
