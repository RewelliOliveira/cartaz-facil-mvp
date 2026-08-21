// ─────────────────────────────────────────────────────────────
// dataParser.ts — Motor de Injeção de Dados
// Converte strings sujas da API legado em objetos estruturados
// Delimitador: !@#
// ─────────────────────────────────────────────────────────────

/** Dados parseados de um preço regular */
export type ParsedRegular = {
  tipo: "regular";
  reais: string;
  centavos: string;
  referencia: string;
  tributos: string;
};

/** Dados parseados de um preço promocional (De / Por) */
export type ParsedPromocao = {
  tipo: "promocao";
  deReais: string;
  deCentavos: string;
  porReais: string;
  porCentavos: string;
  referencia: string;
  tributos: string;
};

/** União de todos os tipos de dados parseados */
export type ParsedProductData = ParsedRegular | ParsedPromocao;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const DELIMITER = "!@#";
const PREFIX_REGULAR = "Preço regular: ";
const PREFIX_PROMOCAO = "Preço de por: ";

/**
 * Limpa o valor de centavos removendo espaços e pontos.
 * Ex.: " .99" → "99", " .19" → "19"
 */
function cleanCentavos(raw: string): string {
  return raw.replace(/[\s.]/g, "");
}

// ─────────────────────────────────────────────────────────────
// Parser principal
// ─────────────────────────────────────────────────────────────

/**
 * Recebe a string bruta vinda da API legado e retorna um objeto
 * estruturado com os dados do produto.
 *
 * @example
 * // Preço regular
 * parseProductString("Preço regular: 12!@# .99!@#1KG R$43.3!@#R$2.88(22.2%)")
 * // → { tipo: 'regular', reais: '12', centavos: '99', referencia: '1KG R$43.3', tributos: 'R$2.88(22.2%)' }
 *
 * @example
 * // Preço promocional
 * parseProductString("Preço de por: 24!@# .49!@#16!@# .19!@#1KG R$46.26!@#R$3.83(23.63%)")
 * // → { tipo: 'promocao', deReais: '24', deCentavos: '49', porReais: '16', porCentavos: '19', referencia: '1KG R$46.26', tributos: 'R$3.83(23.63%)' }
 */
export function parseProductString(raw: string): ParsedProductData {
  if (!raw || typeof raw !== "string") {
    throw new Error("[dataParser] Input inválido: string vazia ou tipo incorreto.");
  }

  const trimmed = raw.trim();

  // ── Cenário 2: Preço "De / Por" (Promoção) ──
  // Verificado ANTES do regular porque o prefixo regular é mais curto
  // e poderia causar falso positivo se a ordem fosse invertida.
  if (trimmed.startsWith(PREFIX_PROMOCAO)) {
    const body = trimmed.slice(PREFIX_PROMOCAO.length);
    const parts = body.split(DELIMITER);

    if (parts.length < 6) {
      throw new Error(
        `[dataParser] Formato de promoção inválido. Esperado ≥6 segmentos, recebido ${parts.length}. Raw: "${raw}"`
      );
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

  // ── Cenário 1: Preço Regular ──
  if (trimmed.startsWith(PREFIX_REGULAR)) {
    const body = trimmed.slice(PREFIX_REGULAR.length);
    const parts = body.split(DELIMITER);

    if (parts.length < 4) {
      throw new Error(
        `[dataParser] Formato regular inválido. Esperado ≥4 segmentos, recebido ${parts.length}. Raw: "${raw}"`
      );
    }

    return {
      tipo: "regular",
      reais: parts[0].trim(),
      centavos: cleanCentavos(parts[1]),
      referencia: parts[2].trim(),
      tributos: parts[3].trim(),
    };
  }

  // ── Nenhum prefixo reconhecido ──
  throw new Error(
    `[dataParser] Prefixo não reconhecido. A string deve começar com "${PREFIX_REGULAR}" ou "${PREFIX_PROMOCAO}". Raw: "${raw}"`
  );
}

// ─────────────────────────────────────────────────────────────
// Substituição de placeholders em templates
// ─────────────────────────────────────────────────────────────

/**
 * Converte um `ParsedProductData` em um mapa plano chave→valor
 * para uso em substituição de templates.
 *
 * Preço regular gera:
 *   {{reais}}, {{centavos}}, {{referencia}}, {{tributos}}
 *
 * Preço promocional gera:
 *   {{deReais}}, {{deCentavos}}, {{porReais}}, {{porCentavos}}, {{referencia}}, {{tributos}}
 */
export function dataToPlaceholderMap(data: ParsedProductData): Record<string, string> {
  if (data.tipo === "regular") {
    return {
      reais: data.reais,
      centavos: data.centavos,
      referencia: data.referencia,
      tributos: data.tributos,
    };
  }

  // tipo === "promocao"
  return {
    deReais: data.deReais,
    deCentavos: data.deCentavos,
    porReais: data.porReais,
    porCentavos: data.porCentavos,
    referencia: data.referencia,
    tributos: data.tributos,
  };
}

/**
 * Recebe uma string de template com placeholders no formato `{{chave}}`
 * e substitui por valores do mapa de dados.
 *
 * @example
 * replacePlaceholders("R$ {{reais}},{{centavos}}", { reais: "12", centavos: "99" })
 * // → "R$ 12,99"
 */
export function replacePlaceholders(
  template: string,
  values: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    return values[key] ?? `{{${key}}}`;
  });
}
