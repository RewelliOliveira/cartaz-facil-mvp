import { useState, useRef, useEffect } from 'react';
import Moveable from 'react-moveable';
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
  // Ref para o container do cartaz
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Elemento DOM ativo selecionado para o react-moveable
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  // Lista de elementos no layout
  const [elementos, setElementos] = useState<LayoutElement[]>(initialLayout);

  // ID do elemento selecionado
  const [selecionadoId, setSelecionadoId] = useState<string | null>(
    initialLayout[0]?.id || null
  );

  // Dimensões dinâmicas do papel (cm)
  const [larguraCm, setLarguraCm] = useState<number>(14);
  const [alturaCm, setAlturaCm] = useState<number>(10);

  // Sincroniza o nó DOM selecionado com o react-moveable
  useEffect(() => {
    if (selecionadoId) {
      const elNode = document.getElementById(selecionadoId);
      setTargetElement(elNode);
    } else {
      setTargetElement(null);
    }
  }, [selecionadoId, elementos]);

  // Elemento ativo para o inspetor
  const elementoSelecionado = elementos.find((el) => el.id === selecionadoId) || null;
  const chavesDisponiveis = Object.keys(dadosProduto);

  // Atualiza um elemento no estado
  const atualizarElemento = (id: string, novasPropriedades: Partial<LayoutElement>) => {
    setElementos((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...novasPropriedades } : el))
    );
  };

  // Garante a unidade em px para fonte
  const handleFontSizeChange = (id: string, value: string) => {
    const raw = value.trim();
    if (!raw) return;
    const formatted = /^\d+$/.test(raw) ? `${raw}px` : raw;
    atualizarElemento(id, { fontSize: formatted });
  };

  // Adiciona novo elemento de texto
  const adicionarElemento = () => {
    const novoId = `elemento-${Date.now()}`;
    const proximaChave = chavesDisponiveis[elementos.length] || `{{CHAVE_${elementos.length}}}`;
    const novoElemento: LayoutElement = {
      id: novoId,
      nome: `Texto ${elementos.length + 1}`,
      tipo: 'texto',
      x: '0.5cm',
      y: '0.5cm',
      fontSize: '18px',
      fontWeight: '700',
      fontFamily: 'Arial, sans-serif',
      color: '#1f2937',
      rotation: 0,
      text: `NOVO TEXTO (${proximaChave})`,
    };
    setElementos((prev) => [...prev, novoElemento]);
    setSelecionadoId(novoId);
  };

  // Remove o elemento selecionado
  const removerElemento = (id: string) => {
    setElementos((prev) => prev.filter((el) => el.id !== id));
    if (selecionadoId === id) {
      setSelecionadoId(null);
    }
  };

  // Troca rápida de tamanho e layout pré-ajustado
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

  // Inserir âncora {{CHAVE_X}}
  const inserirChaveNoTexto = (id: string, chave: string) => {
    const el = elementos.find((item) => item.id === id);
    if (!el) return;
    const currentText = el.text || '';
    const updatedText = currentText ? `${currentText} ${chave}` : chave;
    atualizarElemento(id, { text: updatedText });
  };

  // Substituição dinâmica das chaves {{CHAVE_X}}
  const injectValues = (templateText: string = ''): string => {
    if (!templateText) return '';
    return templateText.replace(/\{\{(CHAVE_\d+)\}\}/g, (match) => {
      return dadosProduto[match] ?? '';
    });
  };

  // Disparo de Impressão em Nova Aba
  const handleImprimir = () => {
    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (!printWindow) {
      alert('Por favor, permita pop-ups para visualizar a impressão.');
      return;
    }

    const cartazElement = document.getElementById('cartaz-container');
    if (!cartazElement) {
      alert('Elemento não encontrado no DOM.');
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
              .no-print, .moveable-control-box {
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
              font-family: system-ui, sans-serif;
            }
            .notice-box {
              margin-bottom: 1.5rem;
              padding: 1rem 1.5rem;
              background: #ffffff;
              border: 1px solid #cbd5e1;
              border-radius: 0.5rem;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="notice-box no-print">
            <h3 style="margin:0 0 0.5rem 0;">🖨️ Impressão (${larguraCm} x ${alturaCm} cm)</h3>
            <p style="margin:0 0 0.75rem 0; color:#475569;">React Moveable Dynamic Engine</p>
            <button onclick="window.print()" style="background:#dc2626; color:white; font-weight:bold; border:none; padding:0.6rem 1.2rem; border-radius:0.375rem; cursor:pointer;">
              Disparar Impressão (Ctrl + P)
            </button>
          </div>
          ${cartazElement.outerHTML}
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 350);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="w-full space-y-6">
      {/* PAINEL SUPERIOR: TAMANHOS DO PAPEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 font-bold flex items-center justify-center text-sm border border-red-500/30">
            ⚡
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              React Moveable Engine
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {larguraCm} x {alturaCm} cm
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Clique em qualquer elemento para Arrastar, Redimensionar e Rotacionar livremente
            </p>
          </div>
        </div>

        {/* Presets Rápidos + Inputs */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {[
              { w: 14, h: 10, label: '14x10 cm' },
              { w: 10, h: 5, label: '10x5 cm' },
              { w: 5, h: 5, label: '5x5 cm ⭐' },
              { w: 5, h: 3, label: '5x3 cm' },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => aplicarPresetTamanho(p.w, p.h)}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  larguraCm === p.w && alturaCm === p.h
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

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
            onClick={handleImprimir}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
          >
            🖨️ Imprimir ({larguraCm}x{alturaCm} cm)
          </button>
        </div>
      </div>

      {/* PAINEL PRINCIPAL (SIDEBAR + CANVAS MOVEABLE) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. SIDEBAR DE PROPRIEDADES (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Camadas */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Camadas do Layout
              </h2>
              <button
                onClick={adicionarElemento}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded transition-all cursor-pointer"
              >
                + Novo Texto
              </button>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {elementos.map((el) => (
                <div
                  key={el.id}
                  onClick={() => setSelecionadoId(el.id)}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    selecionadoId === el.id
                      ? 'bg-red-950/60 border-red-500 text-white font-bold shadow'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="truncate">{el.nome || el.id}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {el.fontSize} • {el.rotation ? `${el.rotation}°` : '0°'}
                    </span>
                    {elementos.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removerElemento(el.id);
                        }}
                        className="text-slate-500 hover:text-red-400 font-bold px-1 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INSPETOR */}
          {elementoSelecionado ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  Inspetor: {elementoSelecionado.nome}
                </h3>
              </div>

              {/* Nome da camada */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Nome da Camada:</label>
                <input
                  type="text"
                  value={elementoSelecionado.nome || ''}
                  onChange={(e) => atualizarElemento(elementoSelecionado.id, { nome: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
                />
              </div>

              {/* Conteúdo do Texto */}
              {elementoSelecionado.tipo !== 'preco_combinado' && (
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                  <label className="block text-[11px] font-bold text-emerald-400 uppercase">
                    Conteúdo do Texto:
                  </label>
                  <input
                    type="text"
                    value={elementoSelecionado.text || ''}
                    onChange={(e) => atualizarElemento(elementoSelecionado.id, { text: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-emerald-300 font-mono"
                  />

                  {/* Pílulas de Âncoras */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {Object.entries(dadosProduto).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => inserirChaveNoTexto(elementoSelecionado.id, key)}
                        className="bg-slate-900 hover:bg-emerald-950 text-slate-200 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono"
                      >
                        <span className="text-emerald-400 font-bold">{key}</span> ({val})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preço Combinado */}
              {elementoSelecionado.tipo === 'preco_combinado' && (
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <label className="block text-slate-400 mb-1">Chave Reais:</label>
                    <select
                      value={elementoSelecionado.chaveReais || '{{CHAVE_0}}'}
                      onChange={(e) => atualizarElemento(elementoSelecionado.id, { chaveReais: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-emerald-400 font-mono text-xs"
                    >
                      {chavesDisponiveis.map((k) => (
                        <option key={k} value={k}>
                          {k} ({dadosProduto[k]})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Chave Centavos:</label>
                    <select
                      value={elementoSelecionado.chaveCentavos || '{{CHAVE_1}}'}
                      onChange={(e) => atualizarElemento(elementoSelecionado.id, { chaveCentavos: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-emerald-400 font-mono text-xs"
                    >
                      {chavesDisponiveis.map((k) => (
                        <option key={k} value={k}>
                          {k} ({dadosProduto[k]})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Tipografia & Estilo */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Fonte:</label>
                  <select
                    value={elementoSelecionado.fontFamily || 'Arial, sans-serif'}
                    onChange={(e) => atualizarElemento(elementoSelecionado.id, { fontFamily: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                  >
                    <option value="Arial, sans-serif">Arial</option>
                    <option value='Impact, "Arial Black", sans-serif'>Impact</option>
                    <option value='"Times New Roman", serif'>Times New Roman</option>
                    <option value='"Courier New", monospace'>Courier New</option>
                    <option value="Verdana, sans-serif">Verdana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tamanho (px):</label>
                  <input
                    type="text"
                    value={elementoSelecionado.fontSize || '16px'}
                    onChange={(e) => handleFontSizeChange(elementoSelecionado.id, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Cor e Rotação */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Cor:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={elementoSelecionado.color || '#000000'}
                      onChange={(e) => atualizarElemento(elementoSelecionado.id, { color: e.target.value })}
                      className="w-8 h-7 bg-slate-950 border border-slate-800 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={elementoSelecionado.color || '#000000'}
                      onChange={(e) => atualizarElemento(elementoSelecionado.id, { color: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Ângulo (°):</label>
                  <input
                    type="number"
                    value={elementoSelecionado.rotation || 0}
                    onChange={(e) => atualizarElemento(elementoSelecionado.id, { rotation: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center text-slate-500 text-xs">
              Selecione um elemento para editar.
            </div>
          )}
        </div>

        {/* 2. CANVAS WYSIWYG MOVEABLE (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-start bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-inner">
          <div className="mb-3 text-center">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest block">
              Canvas React Moveable ({larguraCm} x {alturaCm} cm)
            </span>
            <span className="text-[11px] text-slate-400">
              Alças interativas de Arraste, Redimensionamento e Rotação ativas
            </span>
          </div>

          {/* CANVAS CONTAINER FÍSICO */}
          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 shadow-2xl min-h-[12cm] flex items-center justify-center relative overflow-visible">
            <div
              ref={canvasRef}
              id="cartaz-container"
              className={`relative box-border select-none ${
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
              {/* Elementos Renderizados */}
              {elementos.map((element) => {
                const isSelected = selecionadoId === element.id;
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
                      id={element.id}
                      onClick={() => setSelecionadoId(element.id)}
                      className={`cursor-pointer transition-all inline-block ${
                        isSelected ? 'ring-2 ring-red-500 ring-dashed rounded p-0.5' : ''
                      }`}
                      style={{
                        position: 'absolute',
                        top: element.y,
                        left: element.x,
                        transform: transformStyle,
                        transformOrigin: 'center center',
                        zIndex: element.zIndex || 10,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <div
                        className="flex items-baseline leading-none font-black tracking-tighter"
                        style={{ color: maskOnly ? '#000000' : element.color || '#dc2626' }}
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
                    id={element.id}
                    onClick={() => setSelecionadoId(element.id)}
                    className={`cursor-pointer transition-all inline-block ${
                      isSelected ? 'ring-2 ring-red-500 ring-dashed rounded p-0.5' : ''
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
                      zIndex: element.zIndex || 10,
                      lineHeight: '1',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {renderedText}
                  </div>
                );
              })}
            </div>

            {/* REACT MOVEABLE CONTROLS FLUTUANTE */}
            {targetElement && (
              <Moveable
                target={targetElement}
                container={canvasRef.current}
                draggable={true}
                resizable={false}
                rotatable={true}
                snappable={true}
                snapCenter={true}
                snapThreshold={5}
                origin={false}
                throttleDrag={0}
                throttleRotate={0}
                onDrag={({ left, top }) => {
                  const canvasNode = canvasRef.current;
                  if (!canvasNode || !selecionadoId) return;
                  const rect = canvasNode.getBoundingClientRect();
                  const scaleX = larguraCm / rect.width;
                  const scaleY = alturaCm / rect.height;
                  const xCm = Math.max(0, +(left * scaleX).toFixed(2));
                  const yCm = Math.max(0, +(top * scaleY).toFixed(2));
                  atualizarElemento(selecionadoId, { x: `${xCm}cm`, y: `${yCm}cm` });
                }}
                onRotate={({ beforeRotate }) => {
                  if (!selecionadoId) return;
                  atualizarElemento(selecionadoId, { rotation: Math.round(beforeRotate) });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
