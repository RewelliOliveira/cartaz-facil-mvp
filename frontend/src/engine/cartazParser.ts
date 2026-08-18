export interface ParsedCartazData {
  raw: string;
  tipo: 'regular' | 'de_por';
  reais: string;
  centavos: string;
  precoDeReais?: string;
  precoDeCentavos?: string;
  referencia: string;
  desconto: string;
}

/**
 * Motor Parser de Cartazes.
 * Recebe a string suja enviada pelo banco de dados legado,
 * realiza a quebra por '!@#', limpa ruídos de texto e extrai os campos estruturados sem espaços indesejados.
 */
export function parseCartazData(rawString: string): ParsedCartazData {
  if (!rawString || typeof rawString !== 'string') {
    return {
      raw: '',
      tipo: 'regular',
      reais: '0',
      centavos: '00',
      referencia: '',
      desconto: '',
    };
  }

  // Quebra a string utilizando a chave delimitadora '!@#'
  const parts = rawString.split('!@#').map((part) => part.trim());

  // Utilitário para limpar o valor dos Reais (remove 'Preço regular: ', 'Preço de por: ', etc)
  const cleanReais = (val: string): string => {
    if (!val) return '0';
    return (
      val
        .replace(/^Preço\s+(regular|de\s+por):\s*/i, '')
        .replace(/^R\$\s*/i, '')
        .replace(/[^0-9]/g, '')
        .trim() || '0'
    );
  };

  // Utilitário para limpar os Centavos (remove ponto inicial, espaços e mantém estritamente 2 dígitos)
  const cleanCentavos = (val: string): string => {
    if (!val) return '00';
    const cleaned = val
      .replace(/^\./, '')
      .replace(/[^0-9]/g, '')
      .trim();
    return cleaned.padStart(2, '0').slice(0, 2);
  };

  // Identifica se a string é do tipo 'de_por'
  const isDePor = /de\s+por/i.test(rawString) || parts.length >= 6;

  if (isDePor && parts.length >= 6) {
    return {
      raw: rawString,
      tipo: 'de_por',
      precoDeReais: cleanReais(parts[0]),
      precoDeCentavos: cleanCentavos(parts[1]),
      reais: cleanReais(parts[2]),
      centavos: cleanCentavos(parts[3]),
      referencia: parts[4] || '',
      desconto: parts[5] || '',
    };
  }

  return {
    raw: rawString,
    tipo: 'regular',
    reais: cleanReais(parts[0]),
    centavos: cleanCentavos(parts[1]),
    referencia: parts[2] || '',
    desconto: parts[3] || '',
  };
}
