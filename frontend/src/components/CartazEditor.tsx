import { useState, useRef } from 'react';
import type { ParsedDataDictionary } from '../engine/cartazParser';
import type { LayoutElement } from '../mocks/layoutMock';
import {
  LAYOUT_14X10,
  LAYOUT_10X5,
  LAYOUT_5X5,
  LAYOUT_5X3,
} from '../mocks/layoutMock';

interface CartazEditorProps {
  dadosProduto: ParsedDataDictionary;
  initialLayout?: LayoutElement[];
  maskOnly?: boolean;
}

export const CartazEditor = ({
  dadosProduto,
  initialLayout = LAYOUT_14X10,
  maskOnly = false,
}: CartazEditorProps) => {
  // Ref para o container do cartaz (usado para calcular coordenadas X e Y reais ao arrastar)
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Estado local para armazenar os elementos do layout
  const [elementos, setElementos] = useState<LayoutElement[]>(initialLayout);

  // Estado para controlar o ID do elemento selecionado no canvas
  const [selecionadoId, setSelecionadoId] = useState<string | null>(
    initialLayout[1]?.id || initialLayout[0]?.id || null
  );

  // Estado visual enquanto um elemento está sendo arrastado
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Dimensões Dinâmicas do Papel / Etiqueta em centímetros
  const [larguraCm, setLarguraCm] = useState<number>(14);
  const [alturaCm, setAlturaCm] = useState<number>(10);

  // Elemento ativo para edição no painel lateral
  const elementoSelecionado = elementos.find((el) => el.id === selecionadoId) || null;

  /**
   * Atualiza propriedades do elemento no estado
   */
  const atualizarElemento = (id: string, novasPropriedades: Partial<LayoutElement>) => {
    setElementos((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...novasPropriedades } : el))
    );
  };

  /**
   * Garante a formatação em px para o tamanho da fonte
   */
  const handleFontSizeChange = (id: string, value: string) => {
    const raw = value.trim();
    if (!raw) return;
    const formatted = /^\d+$/.test(raw) ? `${raw}px` : raw;
    atualizarElemento(id, { fontSize: formatted });
  };

  /**
   * Move a posição X e Y em centímetros via botões
   */
  const moverPosicao = (id: string, deltaXcm: number, deltaYcm: number) => {
    const el = elementos.find((item) => item.id === id);
    if (!el) return;
    const posX = parseFloat(el.x.replace('cm', '')) || 0;
    const posY = parseFloat(el.y.replace('cm', '')) || 0;
    const novoX = Math.max(0, +(posX + deltaXcm).toFixed(2));
    const novoY = Math.max(0, +(posY + deltaYcm).toFixed(2));
    atualizarElemento(id, { x: `${novoX}cm`, y: `${novoY}cm` });
  };

  /**
   * INÍCIO DO ARRASTE INTERATIVO (Drag & Drop com o Mouse)
   */
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    e.stopPropagation();
    setSelecionadoId(id);
    setDraggedId(id);
    setIsDragging(true);

    const canvasNode = canvasRef.current;
    if (!canvasNode) return;

    const rect = canvasNode.getBoundingClientRect();
    const scaleX = larguraCm / rect.width; // Fator de conversão Pixel -> CM
    const scaleY = alturaCm / rect.height;

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;

    const targetEl = elementos.find((item) => item.id === id);
    if (!targetEl) return;

    const startXcm = parseFloat(targetEl.x.replace('cm', '')) || 0;
    const startYcm = parseFloat(targetEl.y.replace('cm', '')) || 0;

    // Handler de Movimento do Mouse
    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaXpx = moveEvent.clientX - startMouseX;
      const deltaYpx = moveEvent.clientY - startMouseY;

      const newXcm = Math.max(0, +(startXcm + deltaXpx * scaleX).toFixed(2));
      const newYcm = Math.max(0, +(startYcm + deltaYpx * scaleY).toFixed(2));

      setElementos((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, x: `${newXcm}cm`, y: `${newYcm}cm` } : item
        )
      );
    };

    // Handler de Término do Arraste
    const handlePointerUp = () => {
      setIsDragging(false);
      setDraggedId(null);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  /**
   * Adiciona um novo elemento de texto genérico
   */
  const adicionarElemento = () => {
    const novoId = `elemento-${Date.now()}`;
    const novoElemento: LayoutElement = {
      id: novoId,
      nome: `Novo Texto ${elementos.length + 1}`,
      tipo: 'texto',
      x: '0.5cm',
      y: '0.5cm',
      fontSize: '16px',
      fontWeight: '700',
      fontFamily: 'Arial, sans-serif',
      color: '#1f2937',
      rotation: 0,
      text: 'TEXTO {{CHAVE_0}}',
    };
    setElementos((prev) => [...prev, novoElemento]);
    setSelecionadoId(novoId);
  };

  /**
   * Remove o elemento selecionado
   */
  const removerElemento = (id: string) => {
    setElementos((prev) => prev.filter((el) => el.id !== id));
    if (selecionadoId === id) {
      setSelecionadoId(null);
    }
  };

  /**
   * Aplica presets de tamanho rapidamente e carrega o layout padrão correspondente
   */
  const aplicarPresetTamanho = (w: number, h: number) => {
    setLarguraCm(w);
    setAlturaCm(h);

    let templatePadrao = LAYOUT_14X10;
    if (w === 10 && h === 5) templatePadrao = LAYOUT_10X5;
    else if (w === 5 && h === 5) templatePadrao = LAYOUT_5X5;
    else if (w === 5 && h === 3) templatePadrao = LAYOUT_5X3;

    setElementos(templatePadrao);
    setSelecionadoId(templatePadrao[0]?.id || null);
  };

  /**
   * Substitui qualquer ocorrência de {{CHAVE_X}} pelos valores extraídos do parser
   */
  const injectValues = (templateText: string = ''): string => {
    if (!templateText) return '';
    return templateText.replace(/\{\{(CHAVE_\d+)\}\}/g, (match) => {
      return dadosProduto[match] ?? '';
    });
  };

  /**
   * Dispara a impressão dinamicamente com as dimensões configuradas pelo usuário
   */
  const handleImprimirPersonalizado = () => {
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
          <title>Impressão - ${larguraCm}x${alturaCm} cm</title>
          ${styleTags}
          <style>
            @media print {
              @page {
                size: ${larguraCm}cm ${alturaCm}cm;
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
              🖨️ Impressão (${larguraCm} x ${alturaCm} cm)
            </h3>
            <p style="margin:0 0 0.75rem 0; font-size:0.875rem; color:#475569;">
              Layout com Drag & Drop (Arraste Interativo com o Mouse)
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

          ${cartazElement.outerHTML}

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 350);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="w-full space-y-6">
      {/* PAINEL SUPERIOR: CONFIGURAÇÃO DE DIMENSÕES DINÂMICAS DO PAPEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-500/30">
            📐
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Tamanho do Layout / Etiqueta
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {larguraCm} x {alturaCm} cm
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              💡 <strong>Dica:</strong> Clique e arraste qualquer texto com o mouse para posicioná-lo no cartaz!
            </p>
          </div>
        </div>

        {/* Presets Rápidos + Inputs Personalizados */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Presets com Layouts Padrão Pré-Ajustados */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => aplicarPresetTamanho(14, 10)}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                larguraCm === 14 && alturaCm === 10
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              14x10 cm
            </button>
            <button
              onClick={() => aplicarPresetTamanho(10, 5)}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                larguraCm === 10 && alturaCm === 5
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              10x5 cm
            </button>
            <button
              onClick={() => aplicarPresetTamanho(5, 5)}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                larguraCm === 5 && alturaCm === 5
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              5x5 cm ⭐
            </button>
            <button
              onClick={() => aplicarPresetTamanho(5, 3)}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                larguraCm === 5 && alturaCm === 3
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              5x3 cm
            </button>
          </div>

          {/* Inputs Numéricos Personalizados */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-slate-400 text-[10px]">L:</span>
              <input
                type="number"
                min="1"
                max="50"
                value={larguraCm}
                onChange={(e) => setLarguraCm(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-12 bg-slate-900 border border-slate-700 rounded text-center py-1 text-white font-mono"
              />
              <span className="text-slate-400 text-[10px]">cm</span>
            </div>
            <span className="text-slate-500 font-bold">×</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-400 text-[10px]">A:</span>
              <input
                type="number"
                min="1"
                max="50"
                value={alturaCm}
                onChange={(e) => setAlturaCm(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-12 bg-slate-900 border border-slate-700 rounded text-center py-1 text-white font-mono"
              />
              <span className="text-slate-400 text-[10px]">cm</span>
            </div>
          </div>

          <button
            onClick={handleImprimirPersonalizado}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
          >
            🖨️ Imprimir ({larguraCm}x{alturaCm} cm)
          </button>
        </div>
      </div>

      {/* ÁREA PRINCIPAL DO EDITOR (SIDEBAR + CANVAS) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. PAINEL DE EDIÇÃO (SIDEBAR DE PROPRIEDADES - 5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Lista de Camadas / Elementos */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Camadas do Layout
              </h2>
              <button
                onClick={adicionarElemento}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-all cursor-pointer"
              >
                + Adicionar Texto
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {elementos.map((el) => (
                <div
                  key={el.id}
                  onClick={() => setSelecionadoId(el.id)}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    selecionadoId === el.id
                      ? 'bg-blue-950/60 border-blue-500 text-white font-bold shadow'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="truncate">{el.nome || el.id}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({el.x}, {el.y}) {el.fontSize}
                    </span>
                    {elementos.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removerElemento(el.id);
                        }}
                        className="text-slate-500 hover:text-red-400 font-bold px-1 text-xs"
                        title="Excluir elemento"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INSPETOR DE PROPRIEDADES DO ELEMENTO SELECIONADO */}
          {elementoSelecionado ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Inspetor: {elementoSelecionado.nome}
                </h3>
                <span className="text-[10px] font-mono text-slate-500">{elementoSelecionado.id}</span>
              </div>

              {/* Posição (X e Y) com Nudge Controls */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Posição no Canvas (X e Y em cm):
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <span className="text-[10px] text-slate-400">Posição X (cm):</span>
                    <input
                      type="text"
                      value={elementoSelecionado.x}
                      onChange={(e) =>
                        atualizarElemento(elementoSelecionado.id, { x: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-white font-mono mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Posição Y (cm):</span>
                    <input
                      type="text"
                      value={elementoSelecionado.y}
                      onChange={(e) =>
                        atualizarElemento(elementoSelecionado.id, { y: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-white font-mono mt-0.5"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <button
                    onClick={() => moverPosicao(elementoSelecionado.id, -0.2, 0)}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-2 py-1 rounded cursor-pointer"
                    title="Esquerda"
                  >
                    ◀ 0.2cm
                  </button>
                  <button
                    onClick={() => moverPosicao(elementoSelecionado.id, 0, -0.2)}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-2 py-1 rounded cursor-pointer"
                    title="Cima"
                  >
                    ▲ 0.2cm
                  </button>
                  <button
                    onClick={() => moverPosicao(elementoSelecionado.id, 0, 0.2)}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-2 py-1 rounded cursor-pointer"
                    title="Baixo"
                  >
                    ▼ 0.2cm
                  </button>
                  <button
                    onClick={() => moverPosicao(elementoSelecionado.id, 0.2, 0)}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-2 py-1 rounded cursor-pointer"
                    title="Direita"
                  >
                    0.2cm ▶
                  </button>
                </div>
              </div>

              {/* Tipografia e Tamanho em Pixels (px) */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Família da Fonte:</label>
                  <select
                    value={elementoSelecionado.fontFamily || 'Arial, sans-serif'}
                    onChange={(e) =>
                      atualizarElemento(elementoSelecionado.id, { fontFamily: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-white cursor-pointer"
                  >
                    <option value="Arial, sans-serif">Arial</option>
                    <option value='Impact, "Arial Black", sans-serif'>Impact / Bold</option>
                    <option value='"Times New Roman", serif'>Times New Roman</option>
                    <option value='"Courier New", monospace'>Courier New</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Verdana, sans-serif">Verdana</option>
                    <option value='"Trebuchet MS", sans-serif'>Trebuchet MS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tamanho da Fonte (px):</label>
                  <input
                    type="text"
                    value={elementoSelecionado.fontSize || '16px'}
                    onChange={(e) => handleFontSizeChange(elementoSelecionado.id, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-white font-mono"
                    placeholder="ex: 24px, 84px"
                  />
                </div>
              </div>

              {/* Rotação (0°, 90°, 180°, 270°, 360°) */}
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">
                  Rotação do Elemento:
                </label>
                <div className="flex items-center gap-1.5">
                  {[0, 90, 180, 270, 360].map((deg) => (
                    <button
                      key={deg}
                      onClick={() =>
                        atualizarElemento(elementoSelecionado.id, { rotation: deg })
                      }
                      className={`flex-1 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                        (elementoSelecionado.rotation || 0) === deg
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Cor e Texto / Template */}
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1 text-xs">Cor do Texto:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={elementoSelecionado.color || '#000000'}
                      onChange={(e) =>
                        atualizarElemento(elementoSelecionado.id, { color: e.target.value })
                      }
                      className="w-10 h-8 bg-slate-950 border border-slate-800 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={elementoSelecionado.color || '#000000'}
                      onChange={(e) =>
                        atualizarElemento(elementoSelecionado.id, { color: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {elementoSelecionado.tipo !== 'preco_combinado' && (
                  <div>
                    <label className="block text-slate-400 mb-1 text-xs">
                      Template / Âncoras (<code className="text-yellow-400 font-mono">{"{{CHAVE_X}}"}</code>):
                    </label>
                    <input
                      type="text"
                      value={elementoSelecionado.text || ''}
                      onChange={(e) =>
                        atualizarElemento(elementoSelecionado.id, { text: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-emerald-400 font-mono"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-500 text-xs">
              Selecione uma camada no painel acima ou clique diretamente em um texto no cartaz para editá-lo.
            </div>
          )}
        </div>

        {/* 2. PREVIEW WYSIWYG DO CANVAS (CANVAS INTERATIVO COM DRAG & DROP - 7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-start bg-slate-900/60 border border-slate-800 rounded-xl p-8 shadow-inner">
          <div className="mb-4 text-center">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest block">
              Canvas Interativo Drag & Drop ({larguraCm} cm × {alturaCm} cm)
            </span>
            <span className="text-[11px] text-slate-400">
              Arraste os elementos diretamente com o mouse • Posições atualizadas em tempo real em cm
            </span>
          </div>

          {/* CONTAINER FÍSICO COM DRAG & DROP VIA POINTER EVENTS */}
          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 shadow-2xl min-h-[12cm] flex items-center justify-center">
            <div
              ref={canvasRef}
              id="cartaz-container"
              className={`relative overflow-hidden box-border select-none ${
                maskOnly
                  ? 'bg-transparent border-none shadow-none'
                  : 'bg-white border border-gray-300 shadow-lg print:shadow-none'
              }`}
              style={{
                width: `${larguraCm}cm`,
                height: `${alturaCm}cm`,
                position: 'relative',
                backgroundColor: maskOnly ? 'transparent' : 'white',
                overflow: 'hidden',
              }}
            >
              {/* Iteração e Renderização dos Elementos Interativos com Arraste */}
              {elementos.map((element) => {
                const isSelected = selecionadoId === element.id;
                const isBeingDragged = isDragging && draggedId === element.id;

                if (element.tipo === 'imagem' && maskOnly) {
                  return null;
                }

                const rotationDegree = element.rotation || 0;
                const transformStyle = rotationDegree ? `rotate(${rotationDegree}deg)` : undefined;

                if (element.tipo === 'preco_combinado') {
                  const reaisVal = injectValues(element.chaveReais || '{{CHAVE_0}}');
                  const centavosVal = injectValues(element.chaveCentavos || '{{CHAVE_1}}');
                  const rawCentavos = centavosVal.replace(/^[^0-9]+/, '');
                  const finalCentavos = rawCentavos ? `.${rawCentavos}` : '.00';

                  const basePx = parseFloat((element.fontSize || '84px').replace('px', '')) || 84;
                  const moedapx = `${Math.max(12, Math.round(basePx * 0.28))}px`;
                  const centavopx = `${Math.max(14, Math.round(basePx * 0.45))}px`;

                  return (
                    <div
                      key={element.id}
                      onPointerDown={(e) => handlePointerDown(e, element.id)}
                      className={`cursor-grab active:cursor-grabbing transition-shadow ${
                        isSelected
                          ? 'border-dashed border-2 border-blue-500 bg-blue-50/20 rounded p-1 shadow-md'
                          : 'border border-transparent hover:border-slate-300'
                      }`}
                      style={{
                        position: 'absolute',
                        top: element.y,
                        left: element.x,
                        transform: transformStyle,
                        transformOrigin: 'center center',
                        zIndex: isBeingDragged ? 50 : element.zIndex || 10,
                        whiteSpace: 'nowrap',
                        touchAction: 'none',
                      }}
                    >
                      {/* Tooltip de posição durante o arraste */}
                      {isBeingDragged && (
                        <div className="absolute -top-6 left-0 bg-blue-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none z-50">
                          {element.x}, {element.y}
                        </div>
                      )}

                      <div
                        className="flex items-baseline leading-none font-black tracking-tighter"
                        style={{
                          color: maskOnly ? '#000000' : element.color || '#dc2626',
                        }}
                      >
                        <span
                          className="mr-1 self-start pt-1"
                          style={{
                            fontSize: moedapx,
                            fontFamily: element.fontFamily || 'Impact, "Arial Black", sans-serif',
                          }}
                        >
                          R$
                        </span>
                        <span
                          style={{
                            fontSize: element.fontSize || '84px',
                            fontFamily: element.fontFamily || 'Impact, "Arial Black", sans-serif',
                            lineHeight: '0.85',
                          }}
                        >
                          {reaisVal || '0'}
                        </span>
                        <span
                          className="self-start pt-0.5 font-extrabold border-b-2 border-current ml-0.5"
                          style={{
                            fontSize: centavopx,
                            fontFamily: element.fontFamily || 'Impact, "Arial Black", sans-serif',
                            lineHeight: '1',
                          }}
                        >
                          {finalCentavos}
                        </span>
                      </div>
                    </div>
                  );
                }

                const renderedText = injectValues(element.text);

                return (
                  <div
                    key={element.id}
                    onPointerDown={(e) => handlePointerDown(e, element.id)}
                    className={`cursor-grab active:cursor-grabbing transition-shadow ${
                      isSelected
                        ? 'border-dashed border-2 border-blue-500 bg-blue-50/20 rounded p-1 shadow-md'
                        : 'border border-transparent hover:border-slate-300'
                    }`}
                    style={{
                      position: 'absolute',
                      top: element.y,
                      left: element.x,
                      transform: transformStyle,
                      transformOrigin: 'center center',
                      fontSize: element.fontSize || '14px',
                      fontWeight: element.fontWeight,
                      fontFamily: element.fontFamily || 'sans-serif',
                      color: maskOnly ? '#000000' : element.color || '#000000',
                      backgroundColor: maskOnly ? 'transparent' : element.backgroundColor,
                      borderRadius: element.borderRadius,
                      padding: element.padding,
                      zIndex: isBeingDragged ? 50 : element.zIndex || 10,
                      lineHeight: '1',
                      whiteSpace: 'nowrap',
                      touchAction: 'none',
                    }}
                  >
                    {/* Tooltip de posição durante o arraste */}
                    {isBeingDragged && (
                      <div className="absolute -top-6 left-0 bg-blue-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none z-50">
                        {element.x}, {element.y}
                      </div>
                    )}

                    {element.tipo === 'imagem' && element.src ? (
                      <img
                        src={element.src}
                        alt={element.id}
                        style={{ width: element.width, height: element.height }}
                      />
                    ) : (
                      renderedText
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
