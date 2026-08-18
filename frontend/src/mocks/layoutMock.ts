export interface LayoutElement {
  id: string;
  nome: string;
  tipo: 'texto' | 'preco_combinado';
  x: string; // e.g. "0.6cm"
  y: string; // e.g. "0.4cm"
  fontSize?: string; // e.g. "84px", "24px"
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  rotation?: number; // e.g. 0, 90, 45
  text?: string;
  chaveReais?: string;
  chaveCentavos?: string;
  width?: string;
  height?: string;
  zIndex?: number;
}

export const LAYOUT_14X10: LayoutElement[] = [
  {
    id: 'header-banner',
    nome: 'Banner de Oferta',
    tipo: 'texto',
    x: '0.6cm',
    y: '0.4cm',
    fontSize: '24px',
    fontWeight: '900',
    fontFamily: 'Arial, sans-serif',
    color: '#dc2626',
    rotation: 0,
    text: 'OFERTA IMPERDÍVEL',
  },
  {
    id: 'preco-principal',
    nome: 'Preço Principal',
    tipo: 'preco_combinado',
    x: '0.6cm',
    y: '2.2cm',
    fontSize: '84px',
    fontWeight: '900',
    fontFamily: 'Impact, "Arial Black", sans-serif',
    color: '#dc2626',
    rotation: 0,
    chaveReais: '{{CHAVE_0}}',
    chaveCentavos: '{{CHAVE_1}}',
  },
  {
    id: 'texto-referencia',
    nome: 'Informação de Referência',
    tipo: 'texto',
    x: '0.6cm',
    y: '7.4cm',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: 'Arial, sans-serif',
    color: '#1f2937',
    rotation: 0,
    text: 'REF: {{CHAVE_2}}',
  },
  {
    id: 'texto-desconto',
    nome: 'Tag de Economia',
    tipo: 'texto',
    x: '0.6cm',
    y: '8.3cm',
    fontSize: '14px',
    fontWeight: '800',
    fontFamily: 'Arial, sans-serif',
    color: '#047857',
    rotation: 0,
    text: 'ECONOMIA: {{CHAVE_3}}',
  },
];

export const LAYOUT_10X5: LayoutElement[] = [
  {
    id: 'nome-produto',
    nome: 'Nome do Produto',
    tipo: 'texto',
    x: '0.4cm',
    y: '0.4cm',
    fontSize: '16px',
    fontWeight: '800',
    fontFamily: 'Arial, sans-serif',
    color: '#111827',
    rotation: 0,
    text: 'PRODUTO EM OFERTA',
  },
  {
    id: 'preco-principal',
    nome: 'Preço Principal',
    tipo: 'preco_combinado',
    x: '0.4cm',
    y: '1.4cm',
    fontSize: '56px',
    fontWeight: '900',
    fontFamily: 'Impact, "Arial Black", sans-serif',
    color: '#dc2626',
    rotation: 0,
    chaveReais: '{{CHAVE_0}}',
    chaveCentavos: '{{CHAVE_1}}',
  },
  {
    id: 'texto-referencia',
    nome: 'Referência / Unidade',
    tipo: 'texto',
    x: '0.4cm',
    y: '3.8cm',
    fontSize: '11px',
    fontWeight: '700',
    fontFamily: 'Arial, sans-serif',
    color: '#374151',
    rotation: 0,
    text: 'PREÇO DE {{CHAVE_2}}',
  },
];

export const LAYOUT_5X5: LayoutElement[] = [
  {
    id: 'header-5x5',
    nome: 'Nome / Oferta',
    tipo: 'texto',
    x: '0.3cm',
    y: '0.3cm',
    fontSize: '12px',
    fontWeight: '900',
    fontFamily: 'Arial, sans-serif',
    color: '#dc2626',
    rotation: 0,
    text: 'OFERTA {{CHAVE_2}}',
  },
  {
    id: 'preco-principal',
    nome: 'Preço Principal',
    tipo: 'preco_combinado',
    x: '0.3cm',
    y: '1.4cm',
    fontSize: '36px',
    fontWeight: '900',
    fontFamily: 'Impact, "Arial Black", sans-serif',
    color: '#dc2626',
    rotation: 0,
    chaveReais: '{{CHAVE_0}}',
    chaveCentavos: '{{CHAVE_1}}',
  },
  {
    id: 'rodape-5x5',
    nome: 'Informações Rodapé',
    tipo: 'texto',
    x: '0.3cm',
    y: '3.6cm',
    fontSize: '9px',
    fontWeight: '700',
    fontFamily: 'Arial, sans-serif',
    color: '#1f2937',
    rotation: 0,
    text: 'TRIB. APROX: {{CHAVE_3}}',
  },
];

export const LAYOUT_5X3: LayoutElement[] = [
  {
    id: 'header-5x3',
    nome: 'Título do Produto',
    tipo: 'texto',
    x: '0.2cm',
    y: '0.2cm',
    fontSize: '11px',
    fontWeight: '800',
    fontFamily: 'Arial, sans-serif',
    color: '#000000',
    rotation: 0,
    text: 'PRODUTO {{CHAVE_2}}',
  },
  {
    id: 'preco-principal',
    nome: 'Preço Principal',
    tipo: 'preco_combinado',
    x: '0.2cm',
    y: '0.9cm',
    fontSize: '28px',
    fontWeight: '900',
    fontFamily: 'Impact, "Arial Black", sans-serif',
    color: '#000000',
    rotation: 0,
    chaveReais: '{{CHAVE_0}}',
    chaveCentavos: '{{CHAVE_1}}',
  },
  {
    id: 'rodape-5x3',
    nome: 'Validade / Código',
    tipo: 'texto',
    x: '0.2cm',
    y: '2.2cm',
    fontSize: '8px',
    fontWeight: '600',
    fontFamily: 'Arial, sans-serif',
    color: '#000000',
    rotation: 0,
    text: 'TRIB: {{CHAVE_3}}',
  },
];

export const LAYOUT_MOCK_14X10 = LAYOUT_14X10;
