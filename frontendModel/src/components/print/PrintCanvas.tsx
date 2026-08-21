import { forwardRef } from "react";
import type { LayoutTemplate } from "@/types/layout";
import { replacePlaceholders } from "@/utils/dataParser";

interface PrintCanvasProps {
  template: LayoutTemplate;
  placeholders: Record<string, string> | null;
  quantity?: number;
}

export const PrintCanvas = forwardRef<HTMLDivElement, PrintCanvasProps>(
  ({ template, placeholders, quantity = 1 }, ref) => {
    function resolve(text: string): string {
      if (!placeholders) return text;
      return replacePlaceholders(text, placeholders);
    }

    return (
      <div ref={ref}>
        {Array.from({ length: quantity }).map((_, i) => (
          <div
            key={i}
            style={{
              width: template.width,
              height: template.height,
              position: "relative",
              overflow: "hidden",
              background: "white",
              pageBreakAfter: i < quantity - 1 ? "always" : "auto",
            }}
          >
            {template.elements.map((el) => (
              <span
                key={el.id}
                style={{
                  position: "absolute",
                  left: `${el.x}cm`,
                  top: `${el.y}cm`,
                  fontSize: `${el.fontSize}pt`,
                  fontWeight: el.fontWeight,
                  color: el.color,
                  fontFamily: el.fontFamily,
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                }}
              >
                {resolve(el.text)}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  }
);

PrintCanvas.displayName = "PrintCanvas";
