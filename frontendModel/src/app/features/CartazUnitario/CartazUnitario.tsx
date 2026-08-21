import { useState, useMemo } from "react";
import { Search, Printer, Lock, Unlock, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_PRODUCTS, MOCK_TEMPLATES } from "@/constants/mockData";
import { parseProductString, dataToPlaceholderMap } from "@/utils/dataParser";
import { PrintSheet } from "@/components/print/PrintSheet";
import type { MockProduct, LayoutTemplate } from "@/types/layout";

export function CartazUnitario() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<MockProduct | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState("Oferta");
  const [selectedFormatId, setSelectedFormatId] = useState<string>("tpl-gondola-5x3");
  const [isLocked, setIsLocked] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return MOCK_PRODUCTS;
    const term = searchTerm.toLowerCase().trim();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.code.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term) ||
        (p.barcode && p.barcode.includes(term))
    );
  }, [searchTerm]);

  const selectedTemplate: LayoutTemplate = useMemo(() => {
    return (
      MOCK_TEMPLATES.find((t) => t.id === selectedFormatId) ?? MOCK_TEMPLATES[0]
    );
  }, [selectedFormatId]);

  const parsedProductData = useMemo(() => {
    if (!selectedProduct) return null;
    try {
      const parsed = parseProductString(selectedProduct.rawData);
      return {
        ...dataToPlaceholderMap(parsed),
        nome: selectedProduct.name,
      };
    } catch {
      return null;
    }
  }, [selectedProduct]);

  function handleSelectProduct(product: MockProduct) {
    setSelectedProduct(product);

    if (!isLocked) {
      try {
        const parsed = parseProductString(product.rawData);
        if (parsed.tipo === "promocao") {
          setSelectedCampaign("Promoção De/Por");
          setSelectedFormatId("tpl-promocao-10x5");
        } else {
          setSelectedCampaign("Oferta");
          setSelectedFormatId("tpl-gondola-5x3");
        }
      } catch {
        setSelectedCampaign("Oferta");
      }
    }
  }

  function handleKeyDownSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && filteredProducts.length > 0) {
      handleSelectProduct(filteredProducts[0]);
    }
  }

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50 text-foreground">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Criação de Cartazes
          </h1>
          <p className="text-xs text-muted-foreground">
            Pesquise o produto e configure as opções de balizagem para impressão unitária.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-muted-foreground whitespace-nowrap">
            Selecione a filial:
          </span>
          <Select defaultValue="7">
            <SelectTrigger id="select-filial" className="h-8 text-xs w-45 bg-white">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7" className="text-xs">
                7 - Loja07
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-border shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span>✏️</span> Dados Balizagem
            </h2>
            {selectedProduct && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                Produto Ativo
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              3 - Selecione Valor do Produto:
            </label>
            <Select disabled={!selectedProduct} value={selectedProduct?.id ?? ""}>
              <SelectTrigger id="select-valor" className="h-9 text-xs bg-slate-50 truncate">
                <SelectValue
                  placeholder={
                    selectedProduct
                      ? `${selectedProduct.name} — ${selectedProduct.rawData}`
                      : "Selecione um produto ao lado..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {selectedProduct && (
                  <SelectItem value={selectedProduct.id} className="text-xs">
                    {selectedProduct.rawData}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              4 - Selecione a Campanha:
            </label>
            <Select
              disabled={!selectedProduct}
              value={selectedCampaign}
              onValueChange={setSelectedCampaign}
            >
              <SelectTrigger id="select-campanha" className="h-9 text-xs bg-white">
                <SelectValue placeholder="Selecione a campanha..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Oferta" className="text-xs">
                  Oferta
                </SelectItem>
                <SelectItem value="Normal" className="text-xs">
                  Normal
                </SelectItem>
                <SelectItem value="Promoção De/Por" className="text-xs">
                  Promoção De/Por
                </SelectItem>
                <SelectItem value="Oferta Especial" className="text-xs">
                  Oferta Especial
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              5 - Selecione Formato / modelo:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={!selectedProduct}
                onClick={() => setSelectedFormatId("tpl-gondola-5x3")}
                className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${selectedFormatId === "tpl-gondola-5x3" && selectedProduct
                  ? "border-blue-600 bg-blue-50/50 shadow-xs"
                  : "border-slate-200 hover:border-slate-300"
                  } ${!selectedProduct ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="w-full h-14 bg-white border border-slate-300 rounded flex flex-col items-center justify-center p-1 mb-2">
                  <div className="w-10 h-6 border border-dashed border-slate-400 rounded flex items-center justify-center bg-slate-50 text-[9px] text-slate-500 font-mono">
                    5x3cm
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-800">Etiqueta 5x3cm</p>
                <p className="text-[10px] text-slate-500">Gôndola Padrão</p>
              </button>

              <button
                type="button"
                disabled={!selectedProduct}
                onClick={() => setSelectedFormatId("tpl-promocao-10x5")}
                className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${selectedFormatId === "tpl-promocao-10x5" && selectedProduct
                  ? "border-blue-600 bg-blue-50/50 shadow-xs"
                  : "border-slate-200 hover:border-slate-300"
                  } ${!selectedProduct ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="w-full h-14 bg-white border border-slate-300 rounded flex flex-col items-center justify-center p-1 mb-2">
                  <div className="w-14 h-7 border border-dashed border-slate-400 rounded flex items-center justify-center bg-slate-50 text-[9px] text-slate-500 font-mono">
                    10x5cm
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-800">Etiqueta 10x5cm</p>
                <p className="text-[10px] text-slate-500">Gôndola Grande</p>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-border space-y-3">
            <div className="flex items-center gap-2">
              <Button
                id="btn-add-lista"
                type="button"
                variant="default"
                size="sm"
                disabled={!selectedProduct}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs gap-1.5 flex-1"
              >
                <Plus className="w-3.5 h-3.5" />
                + Lista
              </Button>

              <Button
                id="btn-imprimir-unitario"
                type="button"
                disabled={!selectedProduct}
                onClick={() => setPrintOpen(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 flex-1"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir
              </Button>

              <Button
                id="btn-lock-layout"
                type="button"
                variant={isLocked ? "default" : "outline"}
                size="sm"
                onClick={() => setIsLocked(!isLocked)}
                title={
                  isLocked
                    ? "Layout bloqueado: mantém o formato/campanha ao trocar produto"
                    : "Bloquear formato de impressão"
                }
                className={`px-2.5 ${isLocked
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "border-slate-300 text-slate-700"
                  }`}
              >
                {isLocked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
              </Button>
            </div>

            {isLocked && (
              <p className="text-[10px] text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                🔒 <strong>Layout Bloqueado:</strong> Ao selecionar outro produto, o formato ({selectedTemplate.name}) será mantido automaticamente.
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-border shadow-xs space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              1 - Insira código do produto, marca ou descrição (suporta leitor de código de barras):
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  id="input-search-product"
                  type="text"
                  placeholder="Digite o código (ex: 1443), nome ou escaneie o código de barras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDownSearch}
                  className="pl-9 h-9 text-xs border-blue-300 focus:border-blue-500"
                />
              </div>
              <Select defaultValue="todas">
                <SelectTrigger id="select-sessao" className="h-9 text-xs w-35 bg-white">
                  <SelectValue placeholder="Todas Sessões" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas" className="text-xs">
                    Todas Sessões
                  </SelectItem>
                  <SelectItem value="hortifruti" className="text-xs">
                    Hortifruti
                  </SelectItem>
                  <SelectItem value="padaria" className="text-xs">
                    Padaria / Pizzaria
                  </SelectItem>
                  <SelectItem value="açougue" className="text-xs">
                    Açougue
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                id="btn-pesquisar"
                type="button"
                className="h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
              >
                Pesquisar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-700">
              2 - Clique no produto desejado abaixo:
            </p>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                    <th className="py-2.5 px-4 w-24">Cód</th>
                    <th className="py-2.5 px-4">Descrição</th>
                    <th className="py-2.5 px-4 w-12 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400 italic">
                        Nenhum produto encontrado com &quot;{searchTerm}&quot;.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const isSelected = selectedProduct?.id === p.id;
                      return (
                        <tr
                          key={p.id}
                          onClick={() => handleSelectProduct(p)}
                          className={`cursor-pointer transition-colors duration-150 border-b border-slate-100 ${isSelected
                            ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-semibold"
                            : "hover:bg-slate-50 text-slate-800"
                            }`}
                        >
                          <td className="py-2.5 px-4 font-mono font-bold">{p.code}</td>
                          <td className="py-2.5 px-4 flex items-center gap-1.5">
                            <span>👍</span>
                            <span>{p.name}</span>
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            {isSelected && (
                              <Check className="w-4 h-4 text-emerald-700 inline-block" />
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <PrintSheet
        template={selectedTemplate}
        open={printOpen}
        onOpenChange={setPrintOpen}
        initialPlaceholders={parsedProductData}
      />
    </div>
  );
}
