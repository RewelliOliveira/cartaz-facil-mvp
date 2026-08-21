export type LayoutElement = {
  id: string;
  label: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontWeight: "normal" | "bold" | "600" | "700" | "800" | "900";
  color: string;
  textAlign: "left" | "center" | "right";
  fontFamily: string;
};

export type LayoutTemplate = {
  id: string;
  name: string;
  width: string;
  height: string;
  elements: LayoutElement[];
  isCustom?: boolean;
};

export type MockProduct = {
  id: string;
  code: string;
  name: string;
  rawData: string;
  barcode?: string;
};

export type TemplateSize = {
  label: string;
  description: string;
  width: string;
  height: string;
  starterElements: LayoutElement[];
};
