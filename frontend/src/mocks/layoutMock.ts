export interface LayoutElement {
  id: string;
  nome: string;
  tipo: 'texto' | 'imagem' | 'preco_combinado';
  x: string;
  y: string;
  fontSize?: string; // Em pixels, ex: "84px", "24px", "14px"
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  rotation?: number; // Graus: 0, 90, 180, 270, 360
  text?: string;
  chaveReais?: string;
  chaveCentavos?: string;
  src?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  borderRadius?: string;
  padding?: string;
  zIndex?: number;
}

// Template Padrão para Cartaz 14x10 cm
export const LAYOUT_14X10: LayoutElement[] = [
  {
    id: 'header-banner-14x10',
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
    id: 'preco-principal-14x10',
    nome: 'Preço Principal (Reais + Centavos)',
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
    id: 'texto-referencia-14x10',
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
    id: 'texto-desconto-14x10',
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

// Template Padrão para Etiqueta Média 10x5 cm
export const LAYOUT_10X5: LayoutElement[] = [
  {
    id: 'nome-produto-10x5',
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
    id: 'preco-principal-10x5',
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
    id: 'texto-referencia-10x5',
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

// Template Padrão para Etiqueta Quadrada 5x5 cm ⭐
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
    id: 'preco-principal-5x5',
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

// Template Padrão para Etiqueta Pequena 5x3 cm
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
    id: 'preco-principal-5x3',
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
