import { useRef } from "react";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import type { LayoutSize } from "@/config/layout-size";
import type { CanvasTextElement } from "@/types/canvas";

interface PrintServiceProps {
  layoutSize: LayoutSize;
  elements: CanvasTextElement[];
  disabled?: boolean;
}

function dimensionInPixels(value: string): number {
  return (Number.parseFloat(value) || 1) * 37.8;
}

function resolvePosition(
  value: number | string,
  baseSize: number,
  unit: "cqw" | "cqh",
): string | number {
  return typeof value === "number"
    ? `${(value / baseSize) * 100}${unit}`
    : value;
}

export function PrintService({
  layoutSize,
  elements,
  disabled,
}: PrintServiceProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const printWidth = dimensionInPixels(layoutSize.width);
  const printHeight = dimensionInPixels(layoutSize.height);
  const orientation = printWidth >= printHeight ? "landscape" : "portrait";
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `cartaz-${layoutSize.id}`,
    pageStyle: `
      @page {
        size: ${layoutSize.width} ${layoutSize.height} ${orientation};
        margin: 0;
      }

      @media print {
        html, body {
          width: ${layoutSize.width};
          height: ${layoutSize.height};
          margin: 0;
          padding: 0;
        }

        #cartaz-print-workspace {
          position: static !important;
          left: 0 !important;
          top: 0 !important;
          inset: auto !important;
          display: block !important;
          visibility: visible !important;
          overflow: visible !important;
          margin: 0 !important;
          transform: none !important;
          zoom: 1 !important;
        }
      }
    `,
  });

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handlePrint()}
        disabled={disabled}
        title="Imprimir cartaz"
      >
        <Printer />
        Imprimir
      </Button>

      <div
        ref={contentRef}
        id="cartaz-print-workspace"
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-100000px",
          top: 0,
          width: layoutSize.width,
          height: layoutSize.height,
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          style={{
            position: "relative",
            width: layoutSize.width,
            height: layoutSize.height,
            overflow: "hidden",
            backgroundColor: "#ffffff",
            color: "#111827",
            containerType: "size",
          }}
        >
          {elements.map((element) => (
            <div
              key={element.id}
              style={{
                position: "absolute",
                left: resolvePosition(element.left, printWidth, "cqw"),
                top: resolvePosition(element.top, printHeight, "cqh"),
                width: element.width
                  ? `${(element.width / printWidth) * 100}cqw`
                  : "max-content",
                height: element.height
                  ? `${(element.height / printHeight) * 100}cqh`
                  : undefined,
                transform: element.transform,
                padding: "2px",
                boxSizing: "border-box",
                whiteSpace: "pre-line",
                overflowWrap: "break-word",
                fontFamily: element.fontFamily,
                fontSize: `${(element.fontSize / printWidth) * 100}cqw`,
                fontWeight: element.fontWeight ?? 400,
                fontStyle: element.fontStyle,
                textDecoration: element.underline ? "underline" : "none",
                lineHeight: 1,
                color: element.fill,
              }}
            >
              {element.text}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
