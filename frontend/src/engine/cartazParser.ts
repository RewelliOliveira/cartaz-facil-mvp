export type ParsedDataDictionary = Record<string, string>;
export type ParsedCartazData = ParsedDataDictionary;

/**
 * Motor Parser Genérico Orientado a Chaves Dinâmicas (!@#).
 *
 * Qualquer string bruta enviada pelo banco de dados (ERP/Legado) é limpa de prefixos iniciais
 * e dividida pelo delimitador '!@#'.
 * Cada valor resultante é mapeado sequencialmente para a âncora {{CHAVE_0}}, {{CHAVE_1}}, {{CHAVE_2}}, etc.
 *
 * Exemplos:
 * Entradas: "Preço regular: 12!@# .99!@#1KG R$43.3!@#R$2.88(22.2%)"
 *   -> {{CHAVE_0}}: "12"
 *   -> {{CHAVE_1}}: ".99"
 *   -> {{CHAVE_2}}: "1KG R$43.3"
 *   -> {{CHAVE_3}}: "R$2.88(22.2%)"
 *
 * Entradas: "Preço de por: 24!@# .49!@#16!@# .19!@#1KG R$46.26!@#R$3.83(23.63%)"
 *   -> {{CHAVE_0}}: "24"
 *   -> {{CHAVE_1}}: ".49"
 *   -> {{CHAVE_2}}: "16"
 *   -> {{CHAVE_3}}: ".19"
 *   -> {{CHAVE_4}}: "1KG R$46.26"
 *   -> {{CHAVE_5}}: "R$3.83(23.63%)"
 */
export function parseCartazData(rawString: string): ParsedDataDictionary {
  if (!rawString || typeof rawString !== 'string') {
    return {};
  }

  // Remove qualquer rótulo/prefixo textual antes da primeira sequência de valores (ex: "Preço regular: ", "Preço de por: ", "PROMO: ")
  const cleanedString = rawString
    .replace(/^[\p{L}\s\d]+:\s*/u, '')
    .trim();

  // Faz a divisão estrita pelo delimitador '!@#'
  const parts = cleanedString.split('!@#').map((part) => part.trim());

  const result: ParsedDataDictionary = {};

  parts.forEach((value, index) => {
    const key = `{{CHAVE_${index}}}`;
    result[key] = value;
  });

  return result;
}
