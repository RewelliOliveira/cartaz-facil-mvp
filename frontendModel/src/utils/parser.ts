export type ParsedProductData = {
  reais: string;
  centavos: string;
  referencia: string;
  tipoPreco: "regular" | "por";
  precoPorUnidade: string;
  tributos: string;
  precoAnterior?: string;
};

const LEGACY_SEPARATOR = "!@#";

function cleanNumber(value: string): string {
  return value.replace(/[^\d]/g, "");
}

function cleanReference(value: string): string {
  return value
    .replace(/R\$\s*[\d.,]+/gi, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatCurrency(value: string): string {
  const normalized = value.replace(",", ".");
  const numberValue = Number(normalized);
  if (Number.isNaN(numberValue)) return value.trim();
  return numberValue.toFixed(2);
}

export function parseProductData(rawString: string): ParsedProductData {
  const parts = rawString.split(LEGACY_SEPARATOR).map((part) => part.trim());
  const tipoPreco = /preço\s+de\s+por/i.test(parts[0] ?? "")
    ? "por"
    : "regular";
  const priceParts = parts[0]?.match(/(\d+)\s*$/);
  const reais = priceParts?.[1] ?? "";
  const centavos = cleanNumber(parts[1] ?? "").slice(-2).padStart(2, "0");

  const referencePart = parts.find((part, index) => {
    if (index < 2) return false;
    return /\b\d+\s*(?:KG|G|ML|L|UN|UND)\b/i.test(part);
  });

  const referencia = referencePart
    ? cleanReference(referencePart)
    : parts[2]?.replace(/R\$.*$/i, "").trim() ?? "";

  const unitPriceMatch = referencePart?.match(/R\$\s*([\d.,]+)/i);
  const taxPart = parts.find((part) => /R\$\s*[\d.,]+\s*\([^)]*%\)/i.test(part));
  const taxMatch = taxPart?.match(/R\$\s*([\d.,]+\s*\([^)]*%\))/i);
  const previousPrice = tipoPreco === "por"
    ? `${cleanNumber(parts[2] ?? "")}.${cleanNumber(parts[3] ?? "").slice(-2).padStart(2, "0")}`
    : undefined;

  return {
    reais,
    centavos,
    referencia,
    tipoPreco,
    precoPorUnidade: unitPriceMatch ? formatCurrency(unitPriceMatch[1]) : "",
    tributos: taxMatch ? formatCurrency(taxMatch[1].split("(")[0]) + taxMatch[1].slice(taxMatch[1].indexOf("(")) : "",
    precoAnterior: previousPrice,
  };
}
