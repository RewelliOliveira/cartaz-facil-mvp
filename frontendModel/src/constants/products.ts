export type Product = {
  id: string;
  name: string;
  title: string;
  code: string;
  rawData: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "arroz-1kg",
    name: "Goiaba Vermelha KG",
    title: "GOIABA VERMELHA KG",
    code: "*1443*",
    rawData: "Preço regular: 12!@# .99!@#1KG R$43.3!@#R$2.88(22.2%)",
  },
  {
    id: "feijao-1kg",
    name: "Feijão Carioca 1kg",
    title: "FEIJÃO CARIOCA KG",
    code: "*2031*",
    rawData:
      "Preço de por: 24!@# .49!@#16!@# .19!@#1KG R$46.26!@#R$3.83(23.63%)",
  },
  {
    id: "cafe-500g",
    name: "Café Torrado 500g",
    title: "CAFÉ TORRADO 500G",
    code: "*3210*",
    rawData: "Preço regular: 18!@# .90!@#500G R$24.5!@#R$4.90(19.6%)",
  },
];
