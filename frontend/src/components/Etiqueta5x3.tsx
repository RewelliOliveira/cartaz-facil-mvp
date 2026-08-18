import type { ParsedCartazData } from '../engine/cartazParser';

export interface Etiqueta5x3Coordinates {
  produtoNomeTop?: number;
  moedaTop?: number;
  moedaLeft?: number;
  precoTop?: number;
  precoLeft?: number;
  referenciaTop?: number;
  referenciaLeft?: number;
  rodapeTop?: number;
  rodapeLeft?: number;
}

interface Etiqueta5x3Props {
  data: ParsedCartazData;
  produtoNome?: string;
  ean?: string;
  coords?: Etiqueta5x3Coordinates;
  showGrid?: boolean;
  maskOnly?: boolean;
}

const DEFAULT_COORDS: Required<Etiqueta5x3Coordinates> = {
  produtoNomeTop: 0.35,
  moedaTop: 1.1,
  moedaLeft: 0.3,
  precoTop: 0.95,
  precoLeft: 2.3,
  referenciaTop: 1.95,
  referenciaLeft: 2.4,
  rodapeTop: 2.2,
  rodapeLeft: 0.3,
};

export const Etiqueta5x3 = ({
  data,
  produtoNome = 'GOIABA VERMELHA KG',
  ean = '*1443*',
  coords = {},
  showGrid = false,
  maskOnly = false,
}: Etiqueta5x3Props) => {
  const finalCoords = { ...DEFAULT_COORDS, ...coords };

  return (
    <div
      id="cartaz-container"
      className={`relative overflow-hidden text-black font-sans box-border select-none ${
        maskOnly
          ? 'bg-transparent border-none shadow-none'
          : 'bg-white border border-gray-300 shadow-md print:shadow-none'
      }`}
      style={{
        width: '5cm',
        height: '3cm',
        position: 'relative',
        backgroundColor: maskOnly ? 'transparent' : '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Grid de Calibração Físico (1cm x 1cm) */}
      {showGrid && !maskOnly && (
        <div className="absolute inset-0 pointer-events-none z-50 opacity-30">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)',
              backgroundSize: '1cm 1cm',
            }}
          />
        </div>
      )}

      {/* 1. NOME DO PRODUTO (Centralizado no Topo) */}
      <div
        className="absolute w-full px-1 text-center z-10"
        style={{ top: `${finalCoords.produtoNomeTop}cm` }}
      >
        <p
          className="font-extrabold text-black uppercase tracking-tight text-[11px] leading-tight"
          style={{ fontFamily: 'Arial Black, sans-serif' }}
        >
          {produtoNome}
        </p>
      </div>

      {/* 2. SÍMBOLO DA MOEDA "R$" */}
      <div
        className="absolute font-extrabold text-black z-10 leading-none"
        style={{
          top: `${finalCoords.moedaTop}cm`,
          left: `${finalCoords.moedaLeft}cm`,
          fontSize: '1.25rem',
          fontFamily: 'Arial Black, sans-serif',
        }}
      >
        R$
      </div>

      {/* 3. VALOR DO PREÇO (Reais + Centavos) */}
      <div
        className="absolute z-10 flex items-baseline text-black font-black leading-none tracking-tighter"
        style={{
          top: `${finalCoords.precoTop}cm`,
          left: `${finalCoords.precoLeft}cm`,
        }}
      >
        <span
          style={{
            fontSize: '1.9rem',
            fontFamily: 'Arial Black, Impact, sans-serif',
            lineHeight: '0.9',
          }}
        >
          {data.reais}
        </span>
        <span
          style={{
            fontSize: '1.15rem',
            fontFamily: 'Arial Black, Impact, sans-serif',
            lineHeight: '1',
          }}
        >
          .{data.centavos}
        </span>
      </div>

      {/* 4. TEXTO DE REFERÊNCIA DEBAIXO DO PREÇO */}
      <div
        className="absolute z-10 text-[6.5px] font-bold text-black leading-tight uppercase"
        style={{
          top: `${finalCoords.referenciaTop}cm`,
          left: `${finalCoords.referenciaLeft}cm`,
        }}
      >
        PREÇO DE {data.referencia || `1KG R$${data.reais}.${data.centavos}`}
      </div>

      {/* 5. CÓDIGO E TRIBUTOS APROXIMADOS */}
      <div
        className="absolute z-10 text-[6.5px] font-semibold text-black leading-none"
        style={{
          top: `${finalCoords.rodapeTop}cm`,
          left: `${finalCoords.rodapeLeft}cm`,
        }}
      >
        <p className="font-mono text-[6px] text-black mb-0.5">{ean}</p>
        <p className="text-[6px] text-black">
          Tributos Aprox.: {data.desconto || 'R$.3(4.2%)'}
        </p>
      </div>
    </div>
  );
};
