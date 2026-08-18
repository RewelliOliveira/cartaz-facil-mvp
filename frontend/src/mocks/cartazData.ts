export interface CartazMockItem {
  id: string;
  codigo: string;
  nome: string;
  produtoNome: string;
  categoria: string;
  descricao: string;
  rawString: string;
  validade: string;
  ean: string;
}

export const MOCK_CARTAZES: CartazMockItem[] = [
  {
    id: '0',
    codigo: '1443',
    nome: 'Goiaba Vermelha KG (Foto Real)',
    produtoNome: 'GOIABA VERMELHA KG',
    categoria: 'Hortifrúti',
    descricao: 'Exemplo idêntico às fotos das etiquetas térmicas reais',
    rawString: 'Preço regular: 7!@# .19!@#1KG R$7.19!@#R$.3(4.2%)',
    validade: 'Oferta Válida no Dia',
    ean: '*1443*',
  },
  {
    id: '1',
    codigo: '7896061900174',
    nome: 'Papel Higiênico Sublime 20m C/12',
    produtoNome: 'PAPEL HIG.SUBLIME FOL.D.NOBLE 20M C/12',
    categoria: 'Higiene & Limpeza',
    descricao: 'Modelo idêntico ao cartaz de prateleira (Pin Clube)',
    rawString: 'Preço de por: 15!@# .69!@#12!@# .99!@#1MT R$.65!@#R$2.48(19.09%)',
    validade: 'Oferta Válida de 13/08/2026 até 17/08/2026',
    ean: '*7896061900174*',
  },
  {
    id: '2',
    codigo: '7891025100123',
    nome: 'Detergente Ypê Neutro 500ml',
    produtoNome: 'DETERGENTE LÍQ YPÊ NEUTRO 500ML',
    categoria: 'Limpeza',
    descricao: 'Preço regular simples de supermercado',
    rawString: 'Preço regular: 24!@# .49!@#16!@# .19!@#1KG R$46.26!@#R$3.83(23.63%)',
    validade: 'Oferta Válida até 20/08/2026',
    ean: '*7891025100123*',
  },
  {
    id: '3',
    codigo: '7891000245109',
    nome: 'Sabão em Pó Omo Lavagem Perfeita 1kg',
    produtoNome: 'SABÃO EM PÓ OMO LAVAGEM PERFEITA 1KG',
    categoria: 'Limpeza',
    descricao: 'Promoção De/Por com alto desconto',
    rawString: 'Preço de por: 21!@# .90!@#15!@# .49!@#1KG R$15.49!@#R$6.41(29.2%)',
    validade: 'Oferta Válida de 15/08/2026 até 22/08/2026',
    ean: '*7891000245109*',
  },
  {
    id: '4',
    codigo: '7896005800122',
    nome: 'Arroz Tipo 1 Tio João 5kg',
    produtoNome: 'ARROZ BRANCO TIPO 1 TIO JOÃO 5KG',
    categoria: 'Alimentos',
    descricao: 'Item da cesta básica em promoção de final de semana',
    rawString: 'Preço de por: 34!@# .90!@#26!@# .89!@#1KG R$5.37!@#R$8.01(22.9%)',
    validade: 'Oferta Válida de 14/08/2026 até 18/08/2026',
    ean: '*7896005800122*',
  },
  {
    id: '5',
    codigo: '7898144000155',
    nome: 'Feijão Carioca Kicaldo 1kg',
    produtoNome: 'FEIJÃO CARIOCA KICALDO 1KG',
    categoria: 'Alimentos',
    descricao: 'Preço regular promocional',
    rawString: 'Preço regular: 7!@# .99!@#1KG R$7.99!@#R$1.20(13.0%)',
    validade: 'Oferta Válida até 25/08/2026',
    ean: '*7898144000155*',
  },
  {
    id: '6',
    codigo: '7896045100028',
    nome: 'Café Torrado e Moído 3 Corações 500g',
    produtoNome: 'CAFÉ 3 CORAÇÕES TRADICIONAL 500G',
    categoria: 'Mercearia',
    descricao: 'Oferta especial de café de alta rotação',
    rawString: 'Preço de por: 19!@# .80!@#14!@# .90!@#100G R$2.98!@#R$4.90(24.7%)',
    validade: 'Oferta Válida de 12/08/2026 até 19/08/2026',
    ean: '*7896045100028*',
  },
  {
    id: '7',
    codigo: '7891000100101',
    nome: 'Leite Integral Ninho Forti+ 1L',
    produtoNome: 'LEITE UHT INTEGRAL NINHO 1L',
    categoria: 'Laticínios',
    descricao: 'Preço promocional leve 1L',
    rawString: 'Preço de por: 6!@# .49!@#4!@# .99!@#1L R$4.99!@#R$1.50(23.1%)',
    validade: 'Oferta Válida de 10/08/2026 até 20/08/2026',
    ean: '*7891000100101*',
  },
  {
    id: '8',
    codigo: '7891991000854',
    nome: 'Cerveja Heineken Long Neck 330ml',
    produtoNome: 'CERVEJA HEINEKEN LN 330ML',
    categoria: 'Bebidas',
    descricao: 'Bebidas e cervejas premium',
    rawString: 'Preço regular: 6!@# .79!@#100ML R$2.05!@#R$0.80(10.5%)',
    validade: 'Oferta Válida até 30/08/2026',
    ean: '*7891991000854*',
  }
];

export const DEFAULT_RAW_STRING = MOCK_CARTAZES[0].rawString;

export function searchMockedProducts(query: string): CartazMockItem[] {
  if (!query || query.trim() === '') {
    return MOCK_CARTAZES;
  }
  const q = query.toLowerCase().trim();
  return MOCK_CARTAZES.filter(
    (item) =>
      item.nome.toLowerCase().includes(q) ||
      item.produtoNome.toLowerCase().includes(q) ||
      item.codigo.includes(q) ||
      item.categoria.toLowerCase().includes(q)
  );
}
