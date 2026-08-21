import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, Pencil, LayoutTemplate, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_PRODUCTS } from "@/constants/mockData";
import { NAV_ROUTES } from "@/routes/router-config";
import { useLayouts } from "@/store/layoutsContext";
import { parseProductString, dataToPlaceholderMap, replacePlaceholders } from "@/utils/dataParser";
import { PrintSheet } from "@/components/print/PrintSheet";
import type { LayoutTemplate as TLayoutTemplate } from "@/types/layout";

const PX_PER_CM = 37.8;

function resolveText(text: string, placeholders: Record<string, string> | null): string {
  if (!placeholders) return text;
  return replacePlaceholders(text, placeholders);
}

function TemplatePreview({
  template,
  placeholders,
}: {
  template: TLayoutTemplate;
  placeholders: Record<string, string> | null;
}) {
  const heightCm = parseFloat(template.height);
  const widthCm = parseFloat(template.width);
  const scaleH = 110 / (heightCm * PX_PER_CM);
  const scaleW = 180 / (widthCm * PX_PER_CM);
  const previewScale = Math.min(scaleH, scaleW);

  return (
    <div className="w-full h-28 bg-muted rounded-md flex items-center justify-center overflow-hidden">
      <div
        style={{
          transformOrigin: "center center",
          transform: `scale(${previewScale})`,
          width: template.width,
          height: template.height,
          background: "white",
          border: "1px solid #e5e7eb",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
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
            {resolveText(el.text, placeholders)}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ComponentesProntos() {
  const navigate = useNavigate();
  const { templates, deleteCustomTemplate } = useLayouts();

  const [placeholders, setPlaceholders] = useState<Record<string, string> | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const [printTemplate, setPrintTemplate] = useState<TLayoutTemplate | null>(null);
  const [printOpen, setPrintOpen] = useState(false);

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

  function handlePrint(template: TLayoutTemplate) {
    setPrintTemplate(template);
    setPrintOpen(true);
  }

  function handleEdit(templateId: string) {
    navigate(NAV_ROUTES.layoutDesign.url, {
      state: { templateId, mode: "edit" },
    });
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <LayoutTemplate className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Galeria de Layouts</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Escolha um modelo de cartaz para editar ou enviar para impressão.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6 p-3 bg-muted/50 rounded-lg border border-border">
        <span className="text-sm font-medium whitespace-nowrap">Prévia com produto:</span>
        <Select value={selectedProductId} onValueChange={handleProductChange}>
          <SelectTrigger id="gallery-product-select" className="h-8 text-xs w-55">
            <SelectValue placeholder="Selecione para ver prévia real..." />
          </SelectTrigger>
          <SelectContent>
            {MOCK_PRODUCTS.map((p) => (
              <SelectItem key={p.id} value={p.id} className="text-xs">
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {placeholders && (
          <span className="text-xs text-muted-foreground italic">
            Mostrando dados reais
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="flex flex-col hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="pb-2">
              <TemplatePreview template={template} placeholders={placeholders} />
              <div className="flex items-start justify-between mt-2">
                <CardTitle className="text-base leading-tight">{template.name}</CardTitle>
                {template.isCustom && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium ml-2 shrink-0">
                    Personalizado
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="pb-2 flex-1">
              <p className="text-xs text-muted-foreground">
                Tamanho:{" "}
                <span className="font-medium text-foreground">
                  {template.width} × {template.height}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Elementos:{" "}
                <span className="font-medium text-foreground">
                  {template.elements.length} campos
                </span>
              </p>
            </CardContent>

            <CardFooter className="gap-2 pt-3 border-t border-border flex-wrap">
              <Button
                id={`btn-print-${template.id}`}
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 min-w-0"
                onClick={() => handlePrint(template)}
              >
                <Printer className="w-3.5 h-3.5 shrink-0" />
                Imprimir
              </Button>
              <Button
                id={`btn-edit-${template.id}`}
                size="sm"
                className="flex-1 gap-1.5 min-w-0"
                onClick={() => handleEdit(template.id)}
              >
                <Pencil className="w-3.5 h-3.5 shrink-0" />
                Editar
              </Button>
              {template.isCustom && (
                <Button
                  id={`btn-delete-${template.id}`}
                  variant="destructive"
                  size="sm"
                  className="px-2"
                  onClick={() => deleteCustomTemplate(template.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <PrintSheet
        template={printTemplate}
        open={printOpen}
        onOpenChange={setPrintOpen}
        initialPlaceholders={placeholders}
      />
    </div>
  );
}
