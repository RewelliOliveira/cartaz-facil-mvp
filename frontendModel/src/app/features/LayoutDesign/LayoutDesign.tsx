import { useMemo, useState } from "react";
import { HeaderSettings } from "@/app/features/LayoutDesign/components/HeaderSettings";
import { Footer } from "./components/Footer";
import { LAYOUT_SIZES } from "@/config/layout-size";
import { PRODUCTS, type Product } from "@/constants/products";
import { parseProductData } from "@/utils/parser";
import { Workspace } from "./components/Workspace";
import type { CanvasTextElement } from "./components/Workspace";
import type { TextStyleState } from "@/components/ToggleGroupDemo";

const DEFAULT_FONT = "Montserrat";

function sizeInCm(value: string): number {
  return Number.parseFloat(value) || 1;
}

function responsivePosition(
  value: number | string,
  previousSize: number,
): number | string {
  if (typeof value !== "number") return value;
  const percentage = (value / previousSize) * 100;
  return `${Math.min(95, Math.max(0, percentage))}%`;
}

function createCanvasElements(product: Product): CanvasTextElement[] {
  const parsed = parseProductData(product.rawData);
  const price = `${parsed.reais}.${parsed.centavos}`;
  const unitReference = parsed.referencia
    ? `PREÇO DE\n${parsed.referencia} R$${parsed.precoPorUnidade}`
    : "";

  return [
    {
      id: "titulo",
      label: "Produto",
      text: product.title,
      left: "50%",
      top: "8%",
      transform: "translateX(-50%)",
      fontFamily: DEFAULT_FONT,
      fontSize: 10,
      fontWeight: 600,
      fill: "#111827",
      fontStyle: "normal",
      underline: false,
    },
    {
      id: "simbolo",
      label: "Símbolo",
      text: "R$",
      left: "8%",
      top: "39%",
      fontFamily: DEFAULT_FONT,
      fontSize: 20,
      fontWeight: 700,
      fill: "#111827",
      fontStyle: "normal",
      underline: false,
    },
    {
      id: "preco",
      label: "Preço",
      text: price,
      left: "52%",
      top: "29%",
      transform: "translateX(-50%)",
      fontFamily: DEFAULT_FONT,
      fontSize: 42,
      fontWeight: 800,
      fill: "#111827",
      fontStyle: "normal",
      underline: false,
    },
    {
      id: "preco-unidade",
      label: "Preço por unidade",
      text: unitReference,
      left: "73%",
      top: "58%",
      transform: "translateX(-50%)",
      fontFamily: DEFAULT_FONT,
      fontSize: 8,
      fontWeight: 600,
      fill: "#111827",
      fontStyle: "normal",
      underline: false,
    },
    {
      id: "codigo",
      label: "Código",
      text: product.code,
      left: "8%",
      top: "76%",
      fontFamily: DEFAULT_FONT,
      fontSize: 8,
      fill: "#111827",
      fontStyle: "normal",
      underline: false,
    },
    {
      id: "tributos",
      label: "Tributos",
      text: `Tributos Aprox.: R$${parsed.tributos}`,
      left: "8%",
      top: "87%",
      fontFamily: DEFAULT_FONT,
      fontSize: 7,
      fill: "#111827",
      fontStyle: "normal",
      underline: false,
    },
  ];
}

export function LayoutDesign() {
  const [currentSize, setCurrentSize] = useState(LAYOUT_SIZES[0]);
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [elements, setElements] = useState(() =>
    createCanvasElements(PRODUCTS[0]),
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    "preco",
  );

  const selectedElement = useMemo(
    () =>
      elements.find((element) => element.id === selectedElementId) ?? null,
    [elements, selectedElementId],
  );

  const selectedTextStyle: TextStyleState = {
    bold: (selectedElement?.fontWeight ?? 400) >= 700,
    italic: selectedElement?.fontStyle === "italic",
    underline: selectedElement?.underline ?? false,
  };

  const updateElement = (
    id: string,
    changes: Partial<CanvasTextElement>,
  ) => {
    setElements((currentElements) =>
      currentElements.map((element) =>
        element.id === id ? { ...element, ...changes } : element,
      ),
    );
  };

  const handleProductChange = (nextProduct: Product) => {
    setProduct(nextProduct);
    setElements(createCanvasElements(nextProduct));
    setSelectedElementId("preco");
  };

  const handleSizeChange = (nextSize: (typeof LAYOUT_SIZES)[number]) => {
    const previousWidth = sizeInCm(currentSize.width);
    const previousHeight = sizeInCm(currentSize.height);
    const nextWidth = sizeInCm(nextSize.width);
    const nextHeight = sizeInCm(nextSize.height);
    const widthRatio = nextWidth / previousWidth;
    const heightRatio = nextHeight / previousHeight;
    const fontRatio = Math.min(widthRatio, heightRatio);

    setElements((currentElements) =>
      currentElements.map((element) => ({
        ...element,
        left: responsivePosition(element.left, previousWidth * 37.8),
        top: responsivePosition(element.top, previousHeight * 37.8),
        width: element.width ? element.width * widthRatio : element.width,
        height: element.height
          ? element.height * heightRatio
          : element.height,
        fontSize: Math.max(1, element.fontSize * fontRatio),
      })),
    );
    setCurrentSize(nextSize);
  };

  return (
    <div className="flex flex-col h-dvh w-full overflow-hidden bg-gray-100">
      <HeaderSettings
        currentSize={currentSize}
        onSizeChange={handleSizeChange}
        selectedElement={selectedElement}
        onFontFamilyChange={(fontFamily) => {
          if (selectedElementId) updateElement(selectedElementId, { fontFamily });
        }}
        onFontSizeChange={(fontSize) => {
          if (selectedElementId) updateElement(selectedElementId, { fontSize });
        }}
        onColorChange={(fill) => {
          if (selectedElementId) updateElement(selectedElementId, { fill });
        }}
        textStyle={selectedTextStyle}
        elements={elements}
        onTextStyleChange={({ bold, italic, underline }) => {
          if (!selectedElementId) return;
          updateElement(selectedElementId, {
            fontWeight: bold ? 700 : 400,
            fontStyle: italic ? "italic" : "normal",
            underline,
          });
        }}
      />
      <section className="flex-1 min-h-0 overflow-hidden">
        <Workspace
          layoutSize={currentSize}
          elements={elements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onElementChange={updateElement}
        />
      </section>
      <Footer product={product} onProductChange={handleProductChange} />
    </div>
  );
}
