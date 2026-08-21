import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer, Package } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_PRODUCTS } from "@/constants/mockData";
import { parseProductString, dataToPlaceholderMap, replacePlaceholders } from "@/utils/dataParser";
import { PrintCanvas } from "./PrintCanvas";
import type { LayoutTemplate } from "@/types/layout";

interface PrintSheetProps {
  template: LayoutTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPlaceholders?: Record<string, string> | null;
}

const PX_PER_CM = 37.8;

const defaultProduct = MOCK_PRODUCTS[0];
const defaultParsed = parseProductString(defaultProduct.rawData);
const defaultPlaceholders = { ...dataToPlaceholderMap(defaultParsed), nome: defaultProduct.name };

export function PrintSheet({ template, open, onOpenChange, initialPlaceholders }: PrintSheetProps) {
  const [placeholders, setPlaceholders] = useState<Record<string, string> | null>(
    initialPlaceholders ?? defaultPlaceholders
  );
  const [selectedProductId, setSelectedProductId] = useState<string>(defaultProduct.id);
  const [quantity, setQuantity] = useState(1);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: template?.name ?? "Cartaz",
    pageStyle: template
      ? `
        @page { size: ${template.width} ${template.height}; margin: 0; }
        body { margin: 0; padding: 0; }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      `
      : "",
  });

  function handleProductChange(productId: string | null) {
    if (!productId) return;
    setSelectedProductId(productId);
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    try {
      const parsed = parseProductString(product.rawData);
      setPlaceholders({ ...dataToPlaceholderMap(parsed), nome: product.name });
    } catch {
      setPlaceholders(null);
    }
  }

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, Math.min(50, val)));
  }

  if (!template) return null;

  const widthCm = parseFloat(template.width);
  const heightCm = parseFloat(template.height);
  const maxPreviewWidth = 280;
  const maxPreviewHeight = 180;
  const scaleByWidth = maxPreviewWidth / (widthCm * PX_PER_CM);
  const scaleByHeight = maxPreviewHeight / (heightCm * PX_PER_CM);
  const previewScale = Math.min(scaleByWidth, scaleByHeight, 2.5);

  const canPrint = !!placeholders;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-100 sm:w-110 flex flex-col p-0 gap-0"
      >
        <SheetHeader className="px-5 py-4 border-b border-border shrink-0">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Printer className="w-4 h-4 text-primary" />
            Imprimir — {template.name}
          </SheetTitle>
          <p className="text-xs text-muted-foreground">
            {template.width} × {template.height}
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              Produto
            </label>
            <Select value={selectedProductId} onValueChange={handleProductChange}>
              <SelectTrigger id="print-product-select" className="h-9">
                <SelectValue placeholder="Selecione um produto..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_PRODUCTS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="print-qty" className="text-sm font-medium">
              Quantidade de cópias
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </Button>
              <Input
                id="print-qty"
                type="number"
                min={1}
                max={50}
                value={quantity}
                onChange={handleQuantityChange}
                className="h-9 w-16 text-center"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setQuantity((q) => Math.min(50, q + 1))}
              >
                +
              </Button>
              <span className="text-xs text-muted-foreground">
                {quantity > 1 ? "cópias" : "cópia"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Prévia de impressão</p>
            <div className="bg-neutral-200 rounded-lg flex items-center justify-center min-h-45 p-4">
              <div
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: "center center",
                  width: template.width,
                  height: template.height,
                  position: "relative",
                  background: "white",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {template.elements.map((el) => (
                  <span
                    key={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}cm`,
                      top: `${el.y}cm`,
                      fontSize: `${el.fontSize}pt`,
                      fontWeight: el.fontWeight,
                      color: el.color,
                      fontFamily: el.fontFamily,
                      whiteSpace: "nowrap",
                      lineHeight: 1,
                    }}
                  >
                    {placeholders ? replacePlaceholders(el.text, placeholders) : el.text}
                  </span>
                ))}
              </div>
            </div>
            {!canPrint && (
              <p className="text-xs text-muted-foreground text-center">
                ↑ Selecione um produto para preencher os valores
              </p>
            )}
          </div>

          <div className="p-3 rounded-lg bg-muted/60 border border-border text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Tamanho do papel</span>
              <strong className="text-foreground">{template.width} × {template.height}</strong>
            </div>
            <div className="flex justify-between">
              <span>Cópias</span>
              <strong className="text-foreground">{quantity}</strong>
            </div>
            <div className="flex justify-between">
              <span>Elementos</span>
              <strong className="text-foreground">{template.elements.length} campos</strong>
            </div>
          </div>
        </div>

        <SheetFooter className="px-5 py-4 border-t border-border shrink-0">
          <Button
            id="btn-confirm-print"
            className="w-full gap-2 h-10"
            onClick={() => handlePrint()}
            disabled={!canPrint}
          >
            <Printer className="w-4 h-4" />
            {canPrint
              ? `Imprimir ${quantity} ${quantity > 1 ? "cópias" : "cópia"}`
              : "Selecione um produto para continuar"}
          </Button>
        </SheetFooter>

        <div style={{ position: "absolute", left: "-9999px", top: 0, pointerEvents: "none" }}>
          <PrintCanvas
            ref={printRef}
            template={template}
            placeholders={placeholders}
            quantity={quantity}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
