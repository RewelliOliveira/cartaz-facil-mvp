export type CanvasTextElement = {
  id: string;
  label: string;
  text: string;
  left: number | string;
  top: number | string;
  width?: number;
  height?: number;
  transform?: string;
  fontFamily: string;
  fontSize: number;
  fontWeight?: number;
  fill: string;
  fontStyle: "normal" | "italic";
  underline: boolean;
};
