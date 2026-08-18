import type { ParsedCartazData } from '../engine/cartazParser';

export interface Etiqueta10x5Coordinates {
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

interface Etiqueta10x5Props {
  data: ParsedCartazData;
  produtoNome?: string;
  ean?: string;
  coords?: Etiqueta10x5Coordinates;
  showGrid?: boolean;
  maskOnly?: boolean;
}

const DEFAULT_COORDS: Required<Etiqueta10x5Coordinates> = {
  produtoNomeTop: 0.6,
  moedaTop: 1.8,
  moedaLeft: 0.5,
  precoTop: 3.2,
  precoLeft: 0.5,
  referenciaTop: 5.0,
  referenciaLeft: 0.5,
  rodapeTop: 6.8,
  rodapeLeft: 0.5,
};

export const Etiqueta10x5 = ({
  data,
  produtoNome = 'GOIABA VERMELHA KG',
  ean = '*1443*',
  coords = {},
  showGrid = false,
  maskOnly = false,
}: Etiqueta10x5Props) => {
  const finalCoords = { ...DEFAULT_COORDS, ...coords };

  return (
    <div
      id="cartaz-container"
      className={`relative overflow-hidden text-black font-sans box-border select-none ${
        maskOnly
          ? 'bg-transparent border-none shadow-none'
          : 'bg-white border border-gray-300 shadow-lg print:shadow-none'
      } flex items-center justify-center`}
      style={{
        width: '5cm',
        height: '10cm',
        position: 'relative',
        backgroundColor: maskOnly ? 'transparent' : '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Grid de Calibração Físico na etiqueta em pé (5cm x 10cm) */}
      {showGrid && !maskOnly && (
        <div className="absolute inset-0 pointer-events-none z-50 opacity-25">
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

      {/* Conteúdo com os elementos girados a 90 Graus à Direita dentro da Etiqueta em Pé (5x10cm) */}
      <div
        className={`absolute origin-center transform rotate-90 overflow-hidden ${
          maskOnly ? 'bg-transparent' : 'bg-white'
        }`}
        style={{
          width: '10cm',
          height: '5cm',
          top: '2.5cm',
          left: '-2.5cm',
          position: 'absolute',
        }}
      >
        {/* 1. NOME DO PRODUTO */}
        <div
          className="absolute w-full px-2 text-center z-10"
          style={{ top: `${finalCoords.produtoNomeTop}cm` }}
        >
          <p
            className="font-extrabold text-black uppercase tracking-tight text-sm leading-tight"
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
            fontSize: '2.2rem',
            fontFamily: 'Arial Black, sans-serif',
          }}
        >
          R$
        </div>

        {/* 3. PREÇO GIGANTE (Inteiro + Centavos) */}
        <div
          className="absolute z-10 flex items-baseline text-black font-black leading-none tracking-tighter"
          style={{
            top: `${finalCoords.precoTop}cm`,
            left: `${finalCoords.precoLeft}cm`,
          }}
        >
          <span
            style={{
              fontSize: '3.8rem',
              fontFamily: 'Arial Black, Impact, sans-serif',
              lineHeight: '0.85',
            }}
          >
            {data.reais}
          </span>
          <span
            style={{
              fontSize: '2.2rem',
              fontFamily: 'Arial Black, Impact, sans-serif',
              lineHeight: '1',
            }}
          >
            .{data.centavos}
          </span>
        </div>

        {/* 4. REFERÊNCIA DEBAIXO DO PREÇO */}
        <div
          className="absolute z-10 text-[9px] font-bold text-black leading-tight uppercase"
          style={{
            top: `${finalCoords.referenciaTop}cm`,
            left: `${finalCoords.referenciaLeft}cm`,
          }}
        >
          <p className="font-extrabold">
            PREÇO DE {data.referencia || `1KG R$${data.reais}.${data.centavos}`}
          </p>
        </div>

        {/* 5. CÓDIGO E TRIBUTOS APROXIMADOS */}
        <div
          className="absolute z-10 text-[8px] font-semibold text-black leading-tight"
          style={{
            top: `${finalCoords.rodapeTop}cm`,
            left: `${finalCoords.rodapeLeft}cm`,
          }}
        >
          <p className="font-mono text-[8px] text-black mb-0.5">{ean}</p>
          <p className="text-[7.5px] text-black">
            Tributos Aprox.: {data.desconto || 'R$.3(4.2%)'}
          </p>
        </div>
      </div>
    </div>
  );
};
