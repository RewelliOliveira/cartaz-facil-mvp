import { useState, useMemo } from 'react';
import { MOCK_CARTAZES, searchMockedProducts } from './mocks/cartazData';
import { parseCartazData } from './engine/cartazParser';
import { Cartaz10x14 } from './components/Cartaz10x14';
import { Etiqueta10x5 } from './components/Etiqueta10x5';
import { Etiqueta5x3 } from './components/Etiqueta5x3';
import type { CartazCoordinates } from './components/Cartaz10x14';
import type { CartazMockItem } from './mocks/cartazData';

export type TagSize = '10x14' | '5x10' | '5x3';

export default function App() {
  const [selectedTagSize, setSelectedTagSize] = useState<TagSize>('5x3');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<CartazMockItem>(MOCK_CARTAZES[0]);
  const [rawString, setRawString] = useState<string>(MOCK_CARTAZES[0].rawString);
  const [produtoNome, setProdutoNome] = useState<string>(MOCK_CARTAZES[0].produtoNome);
  const [validade, setValidade] = useState<string>(MOCK_CARTAZES[0].validade);
  const [ean, setEan] = useState<string>(MOCK_CARTAZES[0].ean);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [usePrePrintedPaper, setUsePrePrintedPaper] = useState<boolean>(true);
  const [coords] = useState<CartazCoordinates>({
    ofertaTop: 0.3,
    cartaoAmareloTop: 1.7,
    cartaoAmareloLeft: 0.5,
    produtoNomeTop: 0.3,
    precoDeTop: 2.1,
    precoDeLeft: 0.6,
    precoPorTop: 3.5,
    precoPorLeft: 0.6,
    referenciaTop: 6.8,
    referenciaLeft: 0.6,
    rodapeAmareloTop: 6.8,
    rodapeAmareloLeft: 3.2,
  });

  // Filtra os produtos mocados
  const filteredProducts = useMemo(() => {
    return searchMockedProducts(searchQuery);
  }, [searchQuery]);

  // Executa o motor parser na string bruta atual
  const parsedData = parseCartazData(rawString);

  // Seleciona um produto do catálogo mocado
  const handleSelectProduct = (item: CartazMockItem) => {
    setSelectedProduct(item);
    setRawString(item.rawString);
    setProdutoNome(item.produtoNome);
    setValidade(item.validade);
    setEan(item.ean);
  };

  /**
   * Função Principal de Impressão (Dispara a Impressora da Empresa)
   * 
   * Suporta o "Modo Papel Pré-Impresso": Oculta fundos coloridos e artes,
   * imprimindo APENAS as informações em tinta preta nas posições absolutas exatas!
   */
  const handleImprimir = (autoPrint = true) => {
    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (!printWindow) {
      alert('Por favor, permita pop-ups no navegador para enviar a etiqueta para a impressora.');
      return;
    }

    const cartazElement = document.getElementById('cartaz-container');
    if (!cartazElement) {
      alert('Elemento do cartaz/etiqueta não encontrado no DOM.');
      return;
    }

    const pageSizeCss =
      selectedTagSize === '10x14'
        ? '10cm 14cm'
        : selectedTagSize === '5x10'
        ? '5cm 10cm'
        : '5cm 3cm';

    const styleTags = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]')
    )
      .map((node) => node.outerHTML)
      .join('\n');

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Impressão - Papel ${usePrePrintedPaper ? 'Pré-Impresso (Máscara)' : 'Em Branco'}</title>
          ${styleTags}
          <style>
            @media print {
              @page {
                size: ${pageSizeCss};
                margin: 0;
              }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: transparent !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .no-print {
                display: none !important;
              }
              #cartaz-container {
                box-shadow: none !important;
                border: none !important;
                margin: 0 !important;
                background-color: transparent !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
            }
            body {
              margin: 0;
              padding: 2rem 1rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background-color: #0f172a;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .notice-box {
              margin-bottom: 1.5rem;
              padding: 1rem 1.5rem;
              background: #ffffff;
              border: 1px solid #cbd5e1;
              border-radius: 0.5rem;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
              text-align: center;
              max-width: 460px;
            }
          </style>
        </head>
        <body>
          <div class="notice-box no-print">
            <h3 style="margin:0 0 0.5rem 0; font-size:1.1rem; color:#0f172a; font-weight:bold;">
              🖨️ Modo: ${usePrePrintedPaper ? 'Papel Pré-Impresso (Apenas Dados/Preto)' : 'Papel em Branco (Completo)'}
            </h3>
            <p style="margin:0 0 0.75rem 0; font-size:0.875rem; color:#475569;">
              Produto: <strong>${produtoNome}</strong> (${selectedTagSize} cm)
            </p>
            <div style="display:flex; gap:0.5rem; justify-content:center;">
              <button onclick="window.print()" style="background:#dc2626; color:white; font-weight:bold; border:none; padding:0.6rem 1.2rem; border-radius:0.375rem; cursor:pointer; font-size:0.875rem;">
                🖨️ Disparar Impressão Novamente
              </button>
              <button onclick="window.close()" style="background:#475569; color:white; font-weight:bold; border:none; padding:0.6rem 1rem; border-radius:0.375rem; cursor:pointer; font-size:0.875rem;">
                Fechar Aba
              </button>
            </div>
          </div>

          <!-- Componente da Etiqueta para Impressão -->
          ${cartazElement.outerHTML}

          <script>
            ${
              autoPrint
                ? `
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 350);
              };
            `
                : ''
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-lg shadow-lg">
            C
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              Cartaz Fácil <span className="text-red-500 font-normal">Máscara ERP</span>
            </h1>
            <p className="text-xs text-slate-400">
              Modo Papel Pré-Impresso • Imprime Apenas os Dados em Tinta Preta
            </p>
          </div>
        </div>

        {/* Botão Principal de Impressão Direta */}
        <button
          onClick={() => handleImprimir(true)}
          className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg transition-all flex items-center gap-2 cursor-pointer text-sm"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Imprimir Agora ({selectedTagSize} cm)
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Opções de Impressão & Busca (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Seletor de Tipo de Papel (Pré-Impresso vs Em Branco) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Tipo de Papel na Impressora da Empresa
            </h2>

            <div className="space-y-2">
              <label
                onClick={() => setUsePrePrintedPaper(true)}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  usePrePrintedPaper
                    ? 'bg-emerald-950/40 border-emerald-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="paperType"
                  checked={usePrePrintedPaper}
                  onChange={() => setUsePrePrintedPaper(true)}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <div className="font-bold text-sm text-emerald-400">
                    Papel Pré-Impresso (Recomendado)
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Imprime <strong>APENAS os dados e números em tinta preta</strong> sobre o papel colorido já pronto da empresa. Economiza tempo e tinta!
                  </div>
                </div>
              </label>

              <label
                onClick={() => setUsePrePrintedPaper(false)}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  !usePrePrintedPaper
                    ? 'bg-red-950/40 border-red-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="paperType"
                  checked={!usePrePrintedPaper}
                  onChange={() => setUsePrePrintedPaper(false)}
                  className="mt-0.5 text-red-600 focus:ring-red-500"
                />
                <div className="text-xs">
                  <div className="font-bold text-sm text-slate-200">
                    Papel em Branco (Layout Completo)
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Imprime o fundo amarelo, bordas e marca d'água inteiros.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Card: Seleção de Formato da Etiqueta */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              Selecione o Formato da Etiqueta
            </h2>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedTagSize('5x3')}
                className={`p-3 rounded-lg border text-center transition-all text-xs cursor-pointer ${
                  selectedTagSize === '5x3'
                    ? 'bg-red-950/60 border-red-500 text-white font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-sm font-black">5 x 3 cm</div>
                <div className="text-[10px] mt-0.5 text-emerald-400 font-semibold">Horizontal</div>
              </button>

              <button
                onClick={() => setSelectedTagSize('5x10')}
                className={`p-3 rounded-lg border text-center transition-all text-xs cursor-pointer ${
                  selectedTagSize === '5x10'
                    ? 'bg-red-950/60 border-red-500 text-white font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-sm font-black">5 x 10 cm</div>
                <div className="text-[10px] mt-0.5 text-sky-400 font-semibold">Vertical</div>
              </button>

              <button
                onClick={() => setSelectedTagSize('10x14')}
                className={`p-3 rounded-lg border text-center transition-all text-xs cursor-pointer ${
                  selectedTagSize === '10x14'
                    ? 'bg-red-950/60 border-red-500 text-white font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-sm font-black">10 x 14 cm</div>
                <div className="text-[10px] mt-0.5 text-amber-400 font-semibold">Pin Clube</div>
              </button>
            </div>
          </div>

          {/* Card: Busca de Produtos Mocados */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Pesquisar Produto
              </span>
              <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                {filteredProducts.length} itens
              </span>
            </h2>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por nome, EAN ou categoria..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              <svg
                className="w-4 h-4 text-slate-500 absolute left-3 top-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {filteredProducts.map((item) => {
                const isSelected = selectedProduct.id === item.id;
                const itemParsed = parseCartazData(item.rawString);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectProduct(item)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-red-950/60 border-red-500 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate text-xs">{item.nome}</div>
                      <div className="text-slate-400 text-[10px] truncate">EAN: {item.codigo}</div>
                    </div>
                    <div className="text-right shrink-0 font-black text-red-500 text-xs">
                      R$ {itemParsed.reais},{itemParsed.centavos}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Visualização Dinâmica (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-start bg-slate-900/60 border border-slate-800 rounded-xl p-8 shadow-inner">
          <div className="mb-4 text-center">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest block">
              Pré-Visualização {usePrePrintedPaper ? '(Modo Papel Pré-Impresso / Máscara)' : '(Modo Completo)'}
            </span>
            <span className="text-[11px] text-slate-400">
              {usePrePrintedPaper
                ? 'Apenas dados em tinta preta serão impressos no papel pré-impresso da impressora'
                : 'Imprime layout com cores de fundo'}
            </span>
          </div>

          <div className="flex items-center justify-between w-full max-w-sm mb-4 text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="rounded border-slate-800 text-red-600 focus:ring-red-500"
              />
              Exibir Grid de Calibração (1cm)
            </label>
          </div>

          {/* Renderização do Formato Selecionado com suporte a Máscara */}
          <div
            className={`p-6 rounded-xl border shadow-2xl min-h-[16cm] flex items-center justify-center ${
              usePrePrintedPaper
                ? 'bg-yellow-50 border-amber-300'
                : 'bg-slate-950 border-slate-800'
            }`}
          >
            {selectedTagSize === '5x3' && (
              <Etiqueta5x3
                data={parsedData}
                produtoNome={produtoNome}
                ean={ean}
                showGrid={showGrid}
                maskOnly={usePrePrintedPaper}
              />
            )}

            {selectedTagSize === '5x10' && (
              <Etiqueta10x5
                data={parsedData}
                produtoNome={produtoNome}
                ean={ean}
                showGrid={showGrid}
                maskOnly={usePrePrintedPaper}
              />
            )}

            {selectedTagSize === '10x14' && (
              <Cartaz10x14
                data={parsedData}
                produtoNome={produtoNome}
                validade={validade}
                ean={ean}
                coords={coords}
                showGrid={showGrid}
                maskOnly={usePrePrintedPaper}
              />
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => handleImprimir(true)}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Imprimir Agora ({selectedTagSize} cm)
            </button>

            <button
              onClick={() => handleImprimir(false)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold px-4 py-2.5 rounded-lg border border-slate-700 transition-all cursor-pointer"
            >
              Apenas Visualizar Aba
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
