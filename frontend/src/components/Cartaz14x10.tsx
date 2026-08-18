import type { ParsedDataDictionary } from '../engine/cartazParser';
import type { LayoutElement } from '../mocks/layoutMock';

interface Cartaz14x10Props {
  dadosProduto: ParsedDataDictionary;
  layoutTemplate: LayoutElement[];
  maskOnly?: boolean;
  selectedElementId?: string | null;
  onSelectElement?: (id: string) => void;
}

export const Cartaz14x10 = ({
  dadosProduto,
  layoutTemplate,
  maskOnly = false,
  selectedElementId = null,
  onSelectElement,
}: Cartaz14x10Props) => {
  /**
   * Função auxiliar "A Mágica da Injeção":
   * Lê a propriedade `text` do JSON e substitui qualquer ocorrência
   * da âncora {{CHAVE_X}} pelo valor correspondente vindo da prop dadosProduto.
   */
  const injectValues = (templateText: string = ''): string => {
    if (!templateText) return '';
    return templateText.replace(/\{\{(CHAVE_\d+)\}\}/g, (match) => {
      return dadosProduto[match] ?? '';
    });
  };

  return (
    <div
      id="cartaz-container"
      className={`relative overflow-hidden box-border select-none ${
        maskOnly
          ? 'bg-transparent border-none shadow-none'
          : 'bg-white border border-gray-300 shadow-lg print:shadow-none'
      }`}
      style={{
        width: '14cm',
        height: '10cm',
        position: 'relative',
        backgroundColor: maskOnly ? 'transparent' : 'white',
        overflow: 'hidden',
      }}
    >
      {/* Iteração dinâmica sobre a lista de elementos do template JSON */}
      {layoutTemplate.map((element) => {
        const isSelected = selectedElementId === element.id;

        if (element.tipo === 'imagem' && maskOnly) {
          return null;
        }

        // Renderização Especial para Preço Combinado (Reais + Centavos unidos sem espaço)
        if (element.tipo === 'preco_combinado') {
          const reaisVal = injectValues(element.chaveReais || '{{CHAVE_0}}');
          const centavosVal = injectValues(element.chaveCentavos || '{{CHAVE_1}}');
          const rawCentavos = centavosVal.replace(/^[^0-9]+/, '');
          const finalCentavos = rawCentavos ? `.${rawCentavos}` : '.00';

          return (
            <div
              key={element.id}
              onClick={() => onSelectElement?.(element.id)}
              className={`cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-red-500 ring-offset-2 rounded' : ''
              }`}
              style={{
                position: 'absolute',
                top: element.y,
                left: element.x,
                zIndex: element.zIndex || 10,
                whiteSpace: 'nowrap',
              }}
            >
              <div
                className="flex items-baseline leading-none font-black tracking-tighter"
                style={{
                  color: maskOnly ? '#000000' : element.color || '#dc2626',
                }}
              >
                {/* Símbolo Moeda R$ */}
                <span
                  className="mr-1.5 self-start pt-2"
                  style={{
                    fontSize: '1.6rem',
                    fontFamily: element.fontFamily || 'Impact, "Arial Black", sans-serif',
                  }}
                >
                  R$
                </span>

                {/* Inteiro (Reais) */}
                <span
                  style={{
                    fontSize: element.fontSize || '5.2rem',
                    fontFamily: element.fontFamily || 'Impact, "Arial Black", sans-serif',
                    lineHeight: '0.85',
                  }}
                >
                  {reaisVal || '0'}
                </span>

                {/* Fracionário (Centavos Colados Imediatamente Após os Reais) */}
                <span
                  className="self-start pt-1 font-extrabold border-b-4 border-current ml-0.5"
                  style={{
                    fontSize: '2.5rem',
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
            onClick={() => onSelectElement?.(element.id)}
            className={`cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-red-500 ring-offset-2 rounded' : ''
            }`}
            style={{
              position: 'absolute',
              top: element.y,
              left: element.x,
              fontSize: element.fontSize,
              fontWeight: element.fontWeight,
              fontFamily: element.fontFamily || 'sans-serif',
              color: maskOnly ? '#000000' : element.color || '#000000',
              backgroundColor: maskOnly ? 'transparent' : element.backgroundColor,
              borderRadius: element.borderRadius,
              padding: element.padding,
              zIndex: element.zIndex || 10,
              lineHeight: '1',
              whiteSpace: 'nowrap',
            }}
          >
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
  );
};
