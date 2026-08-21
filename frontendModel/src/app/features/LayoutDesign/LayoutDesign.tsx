import { useState, useCallback, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Type, Save, ZoomIn, ZoomOut, Printer } from "lucide-react";
import { PrintSheet } from "@/components/print/PrintSheet";
import Moveable from "react-moveable";
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
import { parseProductString, dataToPlaceholderMap, replacePlaceholders } from "@/utils/dataParser";
import { useLayouts } from "@/store/layoutsContext";
import type { LayoutElement, LayoutTemplate } from "@/types/layout";
import type { ParsedProductData } from "@/utils/dataParser";
import { NAV_ROUTES } from "@/routes/router-config";

const PX_PER_CM = 37.8;
const PT_TO_PX = 96 / 72;
const MAX_CANVAS_WIDTH = 680;

interface LocationState {
  templateId?: string;
  mode?: "edit" | "create";
  sizeConfig?: {
    label: string;
    width: string;
    height: string;
    starterElements: LayoutElement[];
  };
}

function resolveText(text: string, placeholders: Record<string, string> | null): string {
  if (!placeholders) return text;
  return replacePlaceholders(text, placeholders);
}

function buildBlankTemplate(sizeConfig: NonNullable<LocationState["sizeConfig"]>): LayoutTemplate {
  return {
    id: `custom-${Date.now()}`,
    name: sizeConfig.label,
    width: sizeConfig.width,
    height: sizeConfig.height,
    elements: sizeConfig.starterElements.map((el) => ({ ...el })),
    isCustom: true,
  };
}

export function LayoutDesign() {
  const location = useLocation();
  const navigate = useNavigate();
  const { templates, saveTemplate } = useLayouts();
  const state = location.state as LocationState | null;
  const isCreateMode = state?.mode === "create";

  const initialTemplate: LayoutTemplate = useMemo(() => {
    if (isCreateMode && state?.sizeConfig) {
      return buildBlankTemplate(state.sizeConfig);
    }
    return (
      templates.find((t) => t.id === state?.templateId) ??
      MOCK_TEMPLATES[0]
    );
  }, []);

  const templateWidthCm = parseFloat(initialTemplate.width);
  const initialZoom = Math.min(MAX_CANVAS_WIDTH / (templateWidthCm * PX_PER_CM), 4);

  const [template, setTemplate] = useState<LayoutTemplate>(initialTemplate);
  const [zoom, setZoom] = useState(initialZoom);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedProductData | null>(null);
  const [placeholders, setPlaceholders] = useState<Record<string, string> | null>(null);
  const [templateName, setTemplateName] = useState(initialTemplate.name);
  const [saved, setSaved] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);

  const elementRefs = useRef<Map<string, HTMLSpanElement | null>>(new Map());

  const selectedElement: LayoutElement | undefined = template.elements.find(
    (el) => el.id === selectedElementId
  );

  function handleProductChange(productId: string | null) {
    if (!productId) return;
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    try {
      const parsed = parseProductString(product.rawData);
      setParsedData(parsed);
      setPlaceholders({ ...dataToPlaceholderMap(parsed), nome: product.name });
    } catch (err) {
      console.error("[LayoutDesign]", err);
    }
  }

  const adjustFontSize = useCallback(
    (delta: number) => {
      if (!selectedElementId) return;
      setTemplate((prev) => ({
        ...prev,
        elements: prev.elements.map((el) =>
          el.id === selectedElementId
            ? { ...el, fontSize: Math.max(3, el.fontSize + delta) }
            : el
        ),
      }));
    },
    [selectedElementId]
  );

  function updateElementPosition(id: string, dx: number, dy: number) {
    const scaleFactor = PX_PER_CM * zoom;
    setTemplate((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === id
          ? {
            ...el,
            x: Math.max(0, parseFloat((el.x + dx / scaleFactor).toFixed(3))),
            y: Math.max(0, parseFloat((el.y + dy / scaleFactor).toFixed(3))),
          }
          : el
      ),
    }));
  }

  function handleSave() {
    const toSave: LayoutTemplate = {
      ...template,
      name: templateName,
      isCustom: true,
    };
    saveTemplate(toSave);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const paperWidthPx = parseFloat(template.width) * PX_PER_CM * zoom;
  const paperHeightPx = parseFloat(template.height) * PX_PER_CM * zoom;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-card shadow-sm shrink-0 flex-wrap">
        <Button
          id="btn-back"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground shrink-0"
          onClick={() => navigate(NAV_ROUTES.componentesProntos.url)}
        >
          <ArrowLeft className="w-4 h-4" />
          Galeria
        </Button>

        <div className="w-px h-5 bg-border shrink-0" />

        <Input
          id="input-template-name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="h-7 text-sm font-semibold w-40 border-transparent hover:border-border focus:border-border"
        />

        <div className="w-px h-5 bg-border shrink-0" />

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-muted-foreground">Produto:</span>
          <Select onValueChange={handleProductChange}>
            <SelectTrigger id="select-product" className="h-7 text-xs w-47.5">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {MOCK_PRODUCTS.map((p) => (
                <SelectItem key={p.id} value={p.id} className="text-xs">
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {parsedData && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium shrink-0">
            {parsedData.tipo === "regular" ? "Regular" : "De/Por"}
          </span>
        )}

        <div className="flex-1" />

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            id="btn-zoom-out"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setZoom((z) => Math.max(0.5, parseFloat((z - 0.25).toFixed(2))))}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-xs font-mono w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            id="btn-zoom-in"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setZoom((z) => Math.min(6, parseFloat((z + 0.25).toFixed(2))))}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="w-px h-5 bg-border shrink-0" />

        <div className="flex items-center gap-1.5 shrink-0">
          <Type className="w-3.5 h-3.5 text-muted-foreground" />
          {selectedElement ? (
            <>
              <span className="text-xs text-muted-foreground truncate max-w-22.5">
                {selectedElement.label}
              </span>
              <div className="flex items-center border border-border rounded-md overflow-hidden">
                <Button
                  id="btn-font-dec"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-none"
                  onClick={() => adjustFontSize(-0.5)}
                  disabled={selectedElement.fontSize <= 3}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xs font-mono w-10 text-center select-none">
                  {selectedElement.fontSize}pt
                </span>
                <Button
                  id="btn-font-inc"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-none"
                  onClick={() => adjustFontSize(0.5)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic">Clique num elemento</span>
          )}
        </div>

        <div className="w-px h-5 bg-border shrink-0" />

        <Button
          id="btn-print"
          size="sm"
          variant="outline"
          className="h-7 gap-1.5 shrink-0"
          onClick={() => setPrintOpen(true)}
        >
          <Printer className="w-3.5 h-3.5" />
          Imprimir
        </Button>

        <Button
          id="btn-save"
          size="sm"
          className="h-7 gap-1.5 shrink-0"
          variant={saved ? "outline" : "default"}
          onClick={handleSave}
        >
          <Save className="w-3.5 h-3.5" />
          {saved ? "Salvo!" : isCreateMode ? "Salvar Layout" : "Salvar Alterações"}
        </Button>
      </div>

      <div
        className="flex-1 min-h-0 overflow-auto bg-neutral-300 flex items-start justify-center p-10"
        onClick={() => setSelectedElementId(null)}
      >
        <div style={{ position: "relative" }}>
          <div
            id="canvas-paper"
            style={{
              width: `${paperWidthPx}px`,
              height: `${paperHeightPx}px`,
              background: "white",
              position: "relative",
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {template.elements.map((el) => {
              const isSelected = el.id === selectedElementId;
              return (
                <span
                  key={el.id}
                  id={`el-${el.id}`}
                  ref={(node) => {
                    if (node) elementRefs.current.set(el.id, node);
                    else elementRefs.current.delete(el.id);
                  }}
                  style={{
                    position: "absolute",
                    left: `${el.x * PX_PER_CM * zoom}px`,
                    top: `${el.y * PX_PER_CM * zoom}px`,
                    fontSize: `${el.fontSize * PT_TO_PX * zoom}px`,
                    fontWeight: el.fontWeight,
                    color: el.color,
                    fontFamily: el.fontFamily,
                    textAlign: el.textAlign,
                    whiteSpace: "nowrap",
                    lineHeight: 1,
                    cursor: "grab",
                    userSelect: "none",
                    outline: isSelected ? "1.5px solid #2563eb" : "none",
                    outlineOffset: "2px",
                    backgroundColor: isSelected ? "rgba(37,99,235,0.05)" : "transparent",
                    borderRadius: "2px",
                    padding: "1px 2px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElementId(isSelected ? null : el.id);
                  }}
                >
                  {resolveText(el.text, placeholders)}
                </span>
              );
            })}
          </div>

          {selectedElementId && elementRefs.current.get(selectedElementId) && (
            <Moveable
              target={elementRefs.current.get(selectedElementId) ?? undefined}
              draggable={true}
              origin={false}
              onDrag={({ target, beforeTranslate }) => {
                target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
              }}
              onDragEnd={({ target, lastEvent }) => {
                target.style.transform = "";
                if (!lastEvent || !selectedElementId) return;
                const [dx, dy] = lastEvent.beforeTranslate;
                updateElementPosition(selectedElementId, dx, dy);
              }}
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-1 border-t border-border bg-card text-[10px] text-muted-foreground shrink-0">
        <span>
          Papel:{" "}
          <strong className="text-foreground">
            {template.width} × {template.height}
          </strong>
        </span>
        <span>
          {selectedElement
            ? `"${selectedElement.label}" — ${selectedElement.fontSize}pt`
            : "Nenhum elemento selecionado"}
        </span>
        <span>
          {placeholders
            ? `Dados: ${parsedData?.tipo}`
            : "Sem produto"}
        </span>
      </div>

      <PrintSheet
        template={template}
        open={printOpen}
        onOpenChange={setPrintOpen}
        initialPlaceholders={placeholders}
      />
    </div>
  );
}
