import { useState } from 'react';
import { MOCK_CARTAZES, DEFAULT_RAW_STRING } from './mocks/cartazData';
import { parseCartazData } from './engine/cartazParser';
import { LAYOUT_MOCK_14X10 } from './mocks/layoutMock';
import { CartazEditor } from './components/CartazEditor';

export default function App() {
  const [rawString, setRawString] = useState<string>(DEFAULT_RAW_STRING);
  const [selectedMockId, setSelectedMockId] = useState<string>(MOCK_CARTAZES[0].id);
  const [usePrePrintedPaper, setUsePrePrintedPaper] = useState<boolean>(false);

  // Executa o motor parser para extrair as chaves do produto
  const dadosProduto = parseCartazData(rawString);

  // Altera o produto mocado de exemplo
  const handleSelectMock = (id: string) => {
    const item = MOCK_CARTAZES.find((m) => m.id === id);
    if (!item) return;
    setSelectedMockId(item.id);
    setRawString(item.rawString);
  };

  /**
   * Função de Simulação de Impressão (Nova Aba com @media print)
   * Envia o DOM atualizado do cartaz com as modificações WYSIWYG feitas pelo usuário
   */
  const handleSimularImpressao = (autoPrint = true) => {
    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (!printWindow) {
      alert('Por favor, permita pop-ups no navegador para visualizar a impressão.');
      return;
    }

    const cartazElement = document.getElementById('cartaz-container');
    if (!cartazElement) {
      alert('Elemento do cartaz não encontrado no DOM.');
      return;
    }

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
          <title>Impressão WYSIWYG - Cartaz 14x10 cm</title>
          ${styleTags}
          <style>
            @media print {
              @page {
                size: 14cm 10cm;
                margin: 0;
              }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
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
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              /* Oculta as bordas azuis de seleção na impressão */
              .border-blue-500 {
                border-color: transparent !important;
                background-color: transparent !important;
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
              🖨️ Simulação de Impressão WYSIWYG (14x10 cm)
            </h3>
            <p style="margin:0 0 0.75rem 0; font-size:0.875rem; color:#475569;">
              Imprimindo exatamente com as modificações visuais do editor
            </p>
            <div style="display:flex; gap:0.5rem; justify-content:center;">
              <button onclick="window.print()" style="background:#dc2626; color:white; font-weight:bold; border:none; padding:0.6rem 1.2rem; border-radius:0.375rem; cursor:pointer; font-size:0.875rem;">
                🖨️ Disparar Impressão (Ctrl + P)
              </button>
              <button onclick="window.close()" style="background:#475569; color:white; font-weight:bold; border:none; padding:0.6rem 1rem; border-radius:0.375rem; cursor:pointer; font-size:0.875rem;">
                Fechar Aba
              </button>
            </div>
          </div>

          <!-- HTML do Cartaz Atualizado em Tempo Real -->
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
      {/* Header Superior */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-lg shadow-lg">
            C
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              Cartaz Fácil <span className="text-red-500 font-normal">Editor Visual WYSIWYG</span>
            </h1>
            <p className="text-xs text-slate-400">
              Mini-Canvas 14x10 cm • Seleção de Camadas, Posição, Tipografia e Rotação
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSimularImpressao(true)}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold px-5 py-2.5 rounded-lg shadow-lg transition-all flex items-center gap-2 cursor-pointer text-sm"
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
            Simular Impressão WYSIWYG
          </button>
        </div>
      </header>

      {/* Faixa de Seleção de Exemplo ERP */}
      <div className="bg-slate-900/80 border-b border-slate-800 py-3 px-6 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Produto Mocado:</span>
          <div className="flex items-center gap-2">
            {MOCK_CARTAZES.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectMock(item.id)}
                className={`px-3 py-1 rounded border transition-all cursor-pointer ${
                  selectedMockId === item.id
                    ? 'bg-red-600 border-red-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {item.nome}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={usePrePrintedPaper}
            onChange={(e) => setUsePrePrintedPaper(e.target.checked)}
            className="rounded border-slate-800 text-red-600 focus:ring-red-500"
          />
          Ocultar Arte (Modo Papel Pré-Impresso)
        </label>
      </div>

      {/* Conteúdo Principal do Editor Visual */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <CartazEditor
          dadosProduto={dadosProduto}
          initialLayout={LAYOUT_MOCK_14X10}
          maskOnly={usePrePrintedPaper}
        />
      </main>
    </div>
  );
}
