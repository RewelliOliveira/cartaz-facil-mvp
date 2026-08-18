import type { ParsedCartazData } from '../engine/cartazParser';

export interface CartazCoordinates {
  ofertaTop?: number;
  cartaoAmareloTop?: number;
  cartaoAmareloLeft?: number;
  produtoNomeTop?: number;
  precoDeTop?: number;
  precoDeLeft?: number;
  precoPorTop?: number;
  precoPorLeft?: number;
  referenciaTop?: number;
  referenciaLeft?: number;
  rodapeAmareloTop?: number;
  rodapeAmareloLeft?: number;
}

interface Cartaz10x14Props {
  data: ParsedCartazData;
  produtoNome?: string;
  validade?: string;
  ean?: string;
  coords?: CartazCoordinates;
  showGrid?: boolean;
  maskOnly?: boolean;
}

const DEFAULT_COORDS: Required<CartazCoordinates> = {
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
};

export const Cartaz10x14 = ({
  data,
  produtoNome = 'PAPEL HIG.SUBLIME FOL.D.NOBLE 20M C/12',
  validade = 'Oferta Válida de 13/08/2026 até 17/08/2026',
  ean = '*7896061900174*',
  coords = {},
  showGrid = false,
  maskOnly = false,
}: Cartaz10x14Props) => {
  const finalCoords = { ...DEFAULT_COORDS, ...coords };

  return (
    <div
      id="cartaz-container"
      className={`relative overflow-hidden text-black font-sans box-border select-none ${
        maskOnly
          ? 'bg-transparent border-none shadow-none'
          : 'bg-[#841e17] border border-gray-300 shadow-xl print:shadow-none'
      }`}
      style={{
        width: '10cm',
        height: '14cm',
        position: 'relative',
        backgroundColor: maskOnly ? 'transparent' : '#841e17',
        overflow: 'hidden',
      }}
    >
      {/* Grid de Calibração Físico (1cm x 1cm) opcional */}
      {showGrid && !maskOnly && (
        <div className="absolute inset-0 pointer-events-none z-50 opacity-25">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '1cm 1cm',
            }}
          />
        </div>
      )}

      {/* 1. TÍTULO DO CABEÇALHO "OFERTA" (Oculto no Modo Máscara de Papel Pré-Impresso) */}
      {!maskOnly && (
        <div
          className="absolute w-full text-center z-10"
          style={{ top: `${finalCoords.ofertaTop}cm` }}
        >
          <h1
            className="text-white font-extrabold uppercase tracking-wider drop-shadow-md"
            style={{
              fontSize: '2.1rem',
              fontFamily: 'Arial Black, Impact, sans-serif',
              lineHeight: '1',
            }}
          >
            OFERTA
          </h1>
        </div>
      )}

      {/* 2. CARTÃO AMARELO PRINCIPAL (Transparente no Modo Máscara) */}
      <div
        className={`absolute z-10 overflow-hidden ${
          maskOnly ? 'bg-transparent shadow-none' : 'bg-[#fedc00] rounded-2xl shadow-md'
        }`}
        style={{
          top: `${finalCoords.cartaoAmareloTop}cm`,
          left: `${finalCoords.cartaoAmareloLeft}cm`,
          width: '9.0cm',
          height: '9.3cm',
          position: 'absolute',
        }}
      >
        {/* NOME DO PRODUTO */}
        <div
          className="absolute w-full px-3 text-center z-10"
          style={{ top: `${finalCoords.produtoNomeTop}cm` }}
        >
          <p className="font-extrabold text-black uppercase leading-tight text-[13px] tracking-tight">
            {produtoNome}
          </p>
        </div>

        {/* PREÇO DE (Original) */}
        {data.tipo === 'de_por' && data.precoDeReais && (
          <div
            className="absolute z-10 flex items-baseline gap-2"
            style={{
              top: `${finalCoords.precoDeTop}cm`,
              left: `${finalCoords.precoDeLeft}cm`,
            }}
          >
            <span className="font-black italic text-black text-sm tracking-tight">
              DE R$
            </span>
            <div className="flex items-baseline font-extrabold text-black leading-none">
              <span className="text-2xl" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                {data.precoDeReais}
              </span>
              <span className="text-sm font-bold ml-0.5">.{data.precoDeCentavos}</span>
            </div>
          </div>
        )}

        {/* PREÇO POR (Principal com Maior Destaque em Preto) */}
        <div
          className="absolute z-10 flex items-baseline gap-2"
          style={{
            top: `${finalCoords.precoPorTop}cm`,
            left: `${finalCoords.precoPorLeft}cm`,
          }}
        >
          <span className="font-black italic text-black text-base tracking-tight self-start pt-2">
            Por R$
          </span>
          <div className="flex items-baseline font-black text-black leading-none tracking-tighter">
            <span
              style={{
                fontSize: '4.5rem',
                fontFamily: 'Arial Black, Impact, sans-serif',
                lineHeight: '0.85',
              }}
            >
              {data.reais}
            </span>
            <span
              className="self-start pt-1 font-extrabold"
              style={{
                fontSize: '2.5rem',
                fontFamily: 'Arial Black, Impact, sans-serif',
                lineHeight: '1',
              }}
            >
              .{data.centavos}
            </span>
          </div>
        </div>

        {/* REFERÊNCIA UNITÁRIA */}
        {data.referencia && (
          <div
            className="absolute z-10 text-[9px] font-bold text-black leading-tight"
            style={{
              top: `${finalCoords.referenciaTop}cm`,
              left: `${finalCoords.referenciaLeft}cm`,
              maxWidth: '2.4cm',
            }}
          >
            <p className="text-black font-semibold">Preço de</p>
            <p className="font-extrabold text-black">{data.referencia}</p>
          </div>
        )}

        {/* VALIDADE, TRIBUTOS E CÓDIGO EAN */}
        <div
          className="absolute z-10 text-[8px] font-medium text-black leading-tight"
          style={{
            top: `${finalCoords.rodapeAmareloTop}cm`,
            left: `${finalCoords.rodapeAmareloLeft}cm`,
            maxWidth: '5.5cm',
          }}
        >
          <p className="font-bold">{validade}</p>
          <p className="text-[7.5px] text-black">Tributo Aprox:</p>
          {data.desconto && <p className="font-bold">{data.desconto}</p>}
          <p className="font-mono text-[7px] text-black tracking-wider mt-0.5">{ean}</p>
        </div>

        {/* Mascote de Pin (Oculto no Modo Máscara) */}
        {!maskOnly && (
          <div className="absolute right-1 bottom-1 z-20 pointer-events-none w-12 h-14">
            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow">
              <polygon points="50,5 20,45 35,45 10,85 90,85 65,45 80,45" fill="#2d8a4e" />
              <circle cx="40" cy="50" r="5" fill="white" />
              <circle cx="40" cy="50" r="2.5" fill="black" />
              <circle cx="60" cy="50" r="5" fill="white" />
              <circle cx="60" cy="50" r="2.5" fill="black" />
              <path d="M 42 62 Q 50 70 58 62" stroke="white" strokeWidth="2.5" fill="none" />
              <ellipse cx="38" cy="95" rx="7" ry="4" fill="#6d4c41" />
              <ellipse cx="62" cy="95" rx="7" ry="4" fill="#6d4c41" />
            </svg>
          </div>
        )}
      </div>

      {/* 3. RODAPÉ INFERIOR PIN CLUBE (Oculto no Modo Máscara) */}
      {!maskOnly && (
        <div className="absolute bottom-1.5 left-2 right-2 z-20 flex items-center justify-between gap-1 text-white">
          <div className="bg-white text-black p-1 rounded-md flex items-center gap-1.5 shadow border border-gray-200 w-[4.6cm]">
            <svg className="w-9 h-9 shrink-0" viewBox="0 0 100 100" fill="black">
              <rect x="0" y="0" width="30" height="30" />
              <rect x="5" y="5" width="20" height="20" fill="white" />
              <rect x="10" y="10" width="10" height="10" />
              <rect x="70" y="0" width="30" height="30" />
              <rect x="75" y="5" width="20" height="20" fill="white" />
              <rect x="80" y="10" width="10" height="10" />
              <rect x="0" y="70" width="30" height="30" />
              <rect x="5" y="75" width="20" height="20" fill="white" />
              <rect x="10" y="80" width="10" height="10" />
              <rect x="35" y="5" width="10" height="25" />
              <rect x="50" y="0" width="15" height="10" />
              <rect x="40" y="40" width="20" height="20" />
              <rect x="70" y="40" width="25" height="15" />
              <rect x="35" y="70" width="15" height="25" />
              <rect x="60" y="75" width="30" height="20" />
            </svg>
            <div className="text-[6.5px] leading-[1.1] font-bold text-gray-900 uppercase">
              <p className="font-extrabold text-red-700">CADASTRE-SE NO PIN CLUBE!</p>
              <p className="text-[6px] text-gray-700">escaneie o Qr code</p>
              <p className="text-[6px] text-gray-700 font-semibold">OU ACESSE:</p>
              <p className="text-[5.5px] text-red-600 lowercase font-mono underline">www.pinclube.com.br</p>
            </div>
          </div>

          <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-emerald-500 p-0.5 shadow flex items-center justify-center border border-white">
            <div className="bg-white w-full h-full rounded-full flex flex-col items-center justify-center leading-none text-center">
              <span className="text-[7px] font-black text-orange-600 tracking-tighter">Pin</span>
              <span className="text-[5px] font-bold text-emerald-700 uppercase">clube</span>
            </div>
          </div>

          <div className="text-[6.5px] leading-tight font-medium text-white max-w-[3.6cm]">
            Descontos exclusivos, ofertas, sorteios e muito mais! Vem pro Pin Clube!
          </div>
        </div>
      )}
    </div>
  );
};
