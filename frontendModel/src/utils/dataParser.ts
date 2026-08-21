export type ParsedRegular = {
  tipo: "regular";
  reais: string;
  centavos: string;
  referencia: string;
  tributos: string;
};

export type ParsedPromocao = {
  tipo: "promocao";
  deReais: string;
  deCentavos: string;
  porReais: string;
  porCentavos: string;
  referencia: string;
  tributos: string;
};

export type ParsedProductData = ParsedRegular | ParsedPromocao;

const DELIMITER = "!@#";
const PREFIX_REGULAR = "Preço regular: ";
const PREFIX_PROMOCAO = "Preço de por: ";

function cleanCentavos(raw: string): string {
  return raw.replace(/[\s.]/g, "");
}

export function parseProductString(raw: string): ParsedProductData {
  if (!raw || typeof raw !== "string") {
    throw new Error("[dataParser] Input inválido.");
  }

  const trimmed = raw.trim();

  if (trimmed.startsWith(PREFIX_PROMOCAO)) {
    const parts = trimmed.slice(PREFIX_PROMOCAO.length).split(DELIMITER);
    if (parts.length < 6) {
      throw new Error(`[dataParser] Formato de promoção inválido. Raw: "${raw}"`);
    }
    return {
      tipo: "promocao",
      deReais: parts[0].trim(),
      deCentavos: cleanCentavos(parts[1]),
      porReais: parts[2].trim(),
      porCentavos: cleanCentavos(parts[3]),
      referencia: parts[4].trim(),
      tributos: parts[5].trim(),
    };
  }

  if (trimmed.startsWith(PREFIX_REGULAR)) {
    const parts = trimmed.slice(PREFIX_REGULAR.length).split(DELIMITER);
    if (parts.length < 4) {
      throw new Error(`[dataParser] Formato regular inválido. Raw: "${raw}"`);
    }
    return {
      tipo: "regular",
      reais: parts[0].trim(),
      centavos: cleanCentavos(parts[1]),
      referencia: parts[2].trim(),
      tributos: parts[3].trim(),
    };
  }

  throw new Error(`[dataParser] Prefixo não reconhecido. Raw: "${raw}"`);
}

export function dataToPlaceholderMap(data: ParsedProductData): Record<string, string> {
  if (data.tipo === "regular") {
    const preco = `${data.reais},${data.centavos}`;
    return {
      reais: data.reais,
      centavos: data.centavos,
      precoCompleto: preco,
      porReais: data.reais,
      porCentavos: data.centavos,
      porCompleto: preco,
      deReais: "",
      deCentavos: "",
      deCompleto: "",
      referencia: data.referencia,
      tributos: data.tributos,
    };
  }
  const porPreco = `${data.porReais},${data.porCentavos}`;
  const dePreco = `${data.deReais},${data.deCentavos}`;
  return {
    reais: data.porReais,
    centavos: data.porCentavos,
    precoCompleto: porPreco,
    deReais: data.deReais,
    deCentavos: data.deCentavos,
    deCompleto: dePreco,
    porReais: data.porReais,
    porCentavos: data.porCentavos,
    porCompleto: porPreco,
    referencia: data.referencia,
    tributos: data.tributos,
  };
}

export function replacePlaceholders(
  template: string,
  values: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    return values[key] ?? `{{${key}}}`;
  });
}
