export type ParsedDataDictionary = Record<string, string>;
// Alias de retrocompatibilidade para componentes de etiqueta
export type ParsedCartazData = ParsedDataDictionary;

/**
 * Motor Parser Dinâmico de Cartazes (Data-Driven).
 * Recebe a string suja do banco de dados legado, limpa os prefixos ("Preço regular: ", "Preço de por: "),
 * faz a quebra pelo delimitador '!@#' e retorna um dicionário mapeando âncoras {{CHAVE_X}} para os valores extraídos.
 *
 * Exemplo de retorno:
 * {
 *   "{{CHAVE_0}}": "12",
 *   "{{CHAVE_1}}": ".99",
 *   "{{CHAVE_2}}": "1KG R$43.3",
 *   "{{CHAVE_3}}": "R$2.88(22.2%)"
 * }
 */
export function parseCartazData(rawString: string): ParsedDataDictionary {
  if (!rawString || typeof rawString !== 'string') {
    return {};
  }

  // Remove prefixos como "Preço regular: " ou "Preço de por: "
  const cleanedString = rawString
    .replace(/^Preço\s+(regular|de\s+por):\s*/i, '')
    .trim();

  // Realiza a quebra pelo delimitador '!@#'
  const parts = cleanedString.split('!@#').map((part) => part.trim());

  const result: ParsedDataDictionary = {};

  parts.forEach((value, index) => {
    const key = `{{CHAVE_${index}}}`;
    result[key] = value;
  });

  return result;
}
