import { FontSizePicker } from "@/components/FontSizePicker";
import { FontSizeSelect } from "@/components/FontSizeSelect";
import { LayoutSizeSelect } from "@/components/LayoutSizeSelect";
import {
  ToggleGroupDemo,
  type TextStyleState,
} from "@/components/ToggleGroupDemo";
import { ColorPicker } from "@/components/ColorPicker";
import { PrintService } from "./PrintService";
import type { LayoutSize } from "@/config/layout-size";
import type { CanvasTextElement } from "./Workspace";

interface LayoutSettingsProps {
  currentSize: LayoutSize;
  onSizeChange: (size: LayoutSize) => void;
  selectedElement: CanvasTextElement | null;
  onFontFamilyChange: (fontFamily: string) => void;
  onFontSizeChange: (fontSize: number) => void;
  onColorChange: (color: string) => void;
  textStyle: TextStyleState;
  onTextStyleChange: (style: TextStyleState) => void;
  elements: CanvasTextElement[];
}

export function HeaderSettings({
  currentSize,
  onSizeChange,
  selectedElement,
  onFontFamilyChange,
  onFontSizeChange,
  onColorChange,
  textStyle,
  onTextStyleChange,
  elements,
}: LayoutSettingsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-orange-300 p-2">
      <FontSizeSelect
        value={selectedElement?.fontFamily ?? "Montserrat"}
        onChange={onFontFamilyChange}
      />
      <FontSizePicker
        value={selectedElement?.fontSize ?? 16}
        onChange={onFontSizeChange}
      />
      <ColorPicker
        color={selectedElement?.fill ?? "#111827"}
        onChange={onColorChange}
      />
      <ToggleGroupDemo value={textStyle} onChange={onTextStyleChange} />
      <LayoutSizeSelect currentSize={currentSize} onChange={onSizeChange} />
      <PrintService layoutSize={currentSize} elements={elements} />
    </div>
  );
}
