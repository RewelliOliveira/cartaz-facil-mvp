export interface LayoutElement {
  id: string;
  nome: string;
  tipo: 'texto' | 'imagem' | 'preco_combinado';
  x: string;
  y: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
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

export const LAYOUT_MOCK_14X10: LayoutElement[] = [
  // 1. Banner Superior
  {
    id: 'header-banner',
    nome: 'Banner de Oferta',
    tipo: 'texto',
    x: '0.6cm',
    y: '0.4cm',
    fontSize: '1.4rem',
    fontWeight: '900',
    color: '#dc2626',
    text: 'OFERTA IMPERDÍVEL',
  },
  // 2. Bloco Principal de Preço Unificado (Reais e Centavos Colados Sem Espaço)
  {
    id: 'preco-principal-unificado',
    nome: 'Preço Principal (Reais + Centavos Unidos)',
    tipo: 'preco_combinado',
    x: '0.6cm',
    y: '2.2cm',
    fontSize: '5.2rem',
    fontWeight: '900',
    fontFamily: 'Impact, "Arial Black", sans-serif',
    color: '#dc2626',
    chaveReais: '{{CHAVE_0}}',
    chaveCentavos: '{{CHAVE_1}}',
  },
  // 3. Referência do Produto (Unidade)
  {
    id: 'texto-referencia',
    nome: 'Informação de Referência',
    tipo: 'texto',
    x: '0.6cm',
    y: '7.4cm',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#1f2937',
    text: 'REF: {{CHAVE_2}}',
  },
  // 4. Economia / Desconto
  {
    id: 'texto-desconto',
    nome: 'Tag de Economia',
    tipo: 'texto',
    x: '0.6cm',
    y: '8.3cm',
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#047857',
    text: 'ECONOMIA: {{CHAVE_3}}',
  },
];
