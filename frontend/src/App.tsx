import { useState } from 'react';
import { MOCK_CARTAZES, DEFAULT_RAW_STRING } from './mocks/cartazData';
import { parseCartazData } from './engine/cartazParser';
import { LAYOUT_MOCK_14X10 } from './mocks/layoutMock';
import type { LayoutElement } from './mocks/layoutMock';
import { Cartaz14x10 } from './components/Cartaz14x10';

export default function App() {
  const [rawString, setRawString] = useState<string>(DEFAULT_RAW_STRING);
  const [selectedMockId, setSelectedMockId] = useState<string>(MOCK_CARTAZES[0].id);
  const [usePrePrintedPaper, setUsePrePrintedPaper] = useState<boolean>(false);

  // Estado do Template do Layout Personalizável
  const [layoutTemplate, setLayoutTemplate] = useState<LayoutElement[]>(LAYOUT_MOCK_14X10);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(LAYOUT_MOCK_14X10[1].id);
  const [showJsonExport, setShowJsonExport] = useState<boolean>(false);

  // Executa o motor parser orientado a dados
  const dadosProduto = parseCartazData(rawString);

  // Elemento selecionado para edição no inspetor
  const selectedElement = layoutTemplate.find((el) => el.id === selectedElementId) || null;

  // Atualiza um campo de um elemento do layout
  const handleUpdateElement = (field: keyof LayoutElement, value: string) => {
    if (!selectedElementId) return;
    setLayoutTemplate((prev) =>
      prev.map((el) => (el.id === selectedElementId ? { ...el, [field]: value } : el))
    );
  };

  // Adiciona um novo elemento ao layout personalizável
  const handleAddElement = () => {
    const newId = `elemento-custom-${Date.now()}`;
    const newEl: LayoutElement = {
      id: newId,
      nome: `Novo Elemento ${layoutTemplate.length + 1}`,
      tipo: 'texto',
      x: '2.0cm',
      y: '5.0cm',
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#1e293b',
      text: 'NOVO TEXTO {{CHAVE_0}}',
    };
    setLayoutTemplate((prev) => [...prev, newEl]);
    setSelectedElementId(newId);
  };

  // Remove o elemento selecionado
  const handleDeleteElement = (id: string) => {
    setLayoutTemplate((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  // Manipulador para alterar o exemplo mocado
  const handleSelectMock = (id: string) => {
    const item = MOCK_CARTAZES.find((m) => m.id === id);
    if (!item) return;
    setSelectedMockId(item.id);
    setRawString(item.rawString);
  };

  /**
   * Simulação de Impressão (Nova Aba com @media print)
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
          <title>Impressão Dinâmica - Cartaz 14x10 cm</title>
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
              🖨️ Simulação de Impressão (14x10 cm)
            </h3>
            <p style="margin:0 0 0.75rem 0; font-size:0.875rem; color:#475569;">
              Layout Personalizado Dinâmico
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

          <!-- Componente do Cartaz com Estilos Injetados -->
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
              Cartaz Fácil <span className="text-red-500 font-normal">Editor de Layout Personalizável</span>
            </h1>
            <p className="text-xs text-slate-400">
              Crie e edite layouts dinâmicos ancorados com <code className="text-yellow-400 font-mono">{"{{CHAVE_X}}"}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowJsonExport(!showJsonExport)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-lg border border-slate-700 transition-all cursor-pointer"
          >
            {showJsonExport ? 'Fechar JSON' : 'Exportar JSON'}
          </button>
          <button
            onClick={() => handleSimularImpressao(true)}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold px-5 py-2.5 rounded-lg shadow-lg transition-all flex items-center gap-2 cursor-pointer text-sm"
          >
            Simular Impressão
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Editor de Layout & Dicionário de Chaves (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Editor de Layout Personalizável */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                Editor de Layout Personalizável
              </h2>
              <button
                onClick={handleAddElement}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-all cursor-pointer"
              >
                + Adicionar Elemento
              </button>
            </div>

            {/* Lista de Camadas / Elementos */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Camadas do Layout:</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {layoutTemplate.map((el) => (
                  <div
                    key={el.id}
                    onClick={() => setSelectedElementId(el.id)}
                    className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      selectedElementId === el.id
                        ? 'bg-red-950/60 border-red-500 text-white font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{el.nome || el.id}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">
                        X:{el.x} Y:{el.y}
                      </span>
                      {layoutTemplate.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteElement(el.id);
                          }}
                          className="text-slate-500 hover:text-red-400 text-xs px-1"
                          title="Remover Elemento"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspetor do Elemento Selecionado */}
            {selectedElement && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Propriedades de: {selectedElement.nome || selectedElement.id}
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Posição X (cm)</label>
                    <input
                      type="text"
                      value={selectedElement.x}
                      onChange={(e) => handleUpdateElement('x', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Posição Y (cm)</label>
                    <input
                      type="text"
                      value={selectedElement.y}
                      onChange={(e) => handleUpdateElement('y', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Tamanho Fonte</label>
                    <input
                      type="text"
                      value={selectedElement.fontSize || ''}
                      onChange={(e) => handleUpdateElement('fontSize', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Cor do Texto</label>
                    <input
                      type="color"
                      value={selectedElement.color || '#000000'}
                      onChange={(e) => handleUpdateElement('color', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded h-8 px-1 cursor-pointer"
                    />
                  </div>
                </div>

                {selectedElement.tipo !== 'preco_combinado' && (
                  <div>
                    <label className="text-slate-400 block mb-1 text-xs">Template do Texto / Âncora:</label>
                    <input
                      type="text"
                      value={selectedElement.text || ''}
                      onChange={(e) => handleUpdateElement('text', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-emerald-400 font-mono"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Entrada da String Legada do ERP */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Testar com String Bruta do ERP
            </h2>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {MOCK_CARTAZES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectMock(item.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs cursor-pointer ${
                    selectedMockId === item.id
                      ? 'bg-red-950/60 border-red-500 text-white font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs">{item.nome}</div>
                </button>
              ))}
            </div>

            <textarea
              value={rawString}
              onChange={(e) => setRawString(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Dicionário de Chaves do Parser */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Dicionário de Âncoras do Parser
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {Object.entries(dadosProduto).map(([key, val]) => (
                <div key={key} className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-amber-400 font-bold block">{key}</span>
                  <span className="text-emerald-400 font-extrabold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Canvas Interativo do Cartaz (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-start bg-slate-900/60 border border-slate-800 rounded-xl p-8 shadow-inner">
          <div className="mb-4 text-center">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest block">
              Canvas Interativo de Pré-Visualização (14cm x 10cm)
            </span>
            <span className="text-[11px] text-slate-400">
              Clique em qualquer elemento no cartaz para editá-lo no painel à esquerda
            </span>
          </div>

          {/* Modal / Bloco de Exportação de JSON */}
          {showJsonExport && (
            <div className="w-full mb-4 bg-slate-950 p-4 rounded-xl border border-amber-500/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span>Template JSON do Layout Personalizado:</span>
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(layoutTemplate, null, 2))}
                  className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] hover:bg-amber-400"
                >
                  Copiar JSON
                </button>
              </div>
              <pre className="text-[11px] font-mono text-emerald-400 bg-slate-900 p-3 rounded max-h-48 overflow-y-auto scrollbar-thin">
                {JSON.stringify(layoutTemplate, null, 2)}
              </pre>
            </div>
          )}

          <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={usePrePrintedPaper}
                onChange={(e) => setUsePrePrintedPaper(e.target.checked)}
                className="rounded border-slate-800 text-red-600 focus:ring-red-500"
              />
              Ocultar Arte de Fundo (Modo Papel Pré-Impresso)
            </label>
          </div>

          {/* Renderização do Cartaz no Canvas */}
          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 shadow-2xl min-h-[12cm] flex items-center justify-center">
            <Cartaz14x10
              dadosProduto={dadosProduto}
              layoutTemplate={layoutTemplate}
              maskOnly={usePrePrintedPaper}
              selectedElementId={selectedElementId}
              onSelectElement={(id) => setSelectedElementId(id)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
