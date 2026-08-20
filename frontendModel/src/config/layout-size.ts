export type LayoutSize = {
  id: string;
  name: string;
  width: string;
  height: string;
};

export const LAYOUT_SIZES: LayoutSize[] = [
  { id: "1", name: "Medium Poster (14x10cm)", width: "14cm", height: "10cm" },
  { id: "2", name: "Produce Label (10x5cm)", width: "10cm", height: "5cm" },
  { id: "3", name: "Shelf Label (5x3cm)", width: "5cm", height: "3cm" },
];
