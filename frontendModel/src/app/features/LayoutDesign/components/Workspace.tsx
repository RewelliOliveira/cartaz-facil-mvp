import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Canvas as FabricCanvas,
  IText,
  Textbox,
  type FabricObject,
} from "fabric";
import type { LayoutSize } from "@/config/layout-size";

export type CanvasTextElement = {
  id: string;
  label: string;
  text: string;
  left: number | string;
  top: number | string;
  width?: number;
  height?: number;
  transform?: string;
  fontFamily: string;
  fontSize: number;
  fontWeight?: number;
  fill: string;
  fontStyle: "normal" | "italic";
  underline: boolean;
};

interface WorkspaceProps {
  layoutSize: LayoutSize;
  elements: CanvasTextElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onElementChange: (id: string, changes: Partial<CanvasTextElement>) => void;
}

type DesignTextbox = Textbox & { dataElementId?: string };

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

function resolveCoordinate(value: number | string, size: number): number {
  if (typeof value === "number") return value;
  if (value.endsWith("%")) return (Number.parseFloat(value) / 100) * size;
  return Number.parseFloat(value) || 0;
}

function getElementId(target?: FabricObject | null): string | undefined {
  return (target as DesignTextbox | undefined)?.dataElementId;
}

function isCornerControl(corner?: string): boolean {
  return ["tl", "tr", "bl", "br"].includes(corner ?? "");
}

export function Workspace({
  layoutSize,
  elements,
  selectedElementId,
  onSelectElement,
  onElementChange,
}: WorkspaceProps) {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const objectsRef = useRef(new Map<string, DesignTextbox>());
  const onSelectElementRef = useRef(onSelectElement);
  const onElementChangeRef = useRef(onElementChange);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [baseSize, setBaseSize] = useState({ width: 0, height: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);

  const fitScale =
    baseSize.width > 0 && baseSize.height > 0 && viewportSize.width > 0
      ? Math.max(
          0.35,
          Math.min(
            4,
            (viewportSize.width - 64) / baseSize.width,
            (viewportSize.height - 64) / baseSize.height,
          ),
        )
      : 1;
  const displayScale = fitScale * zoom;

  useEffect(() => {
    onSelectElementRef.current = onSelectElement;
    onElementChangeRef.current = onElementChange;
  }, [onElementChange, onSelectElement]);

  const changeZoom = (amount: number) => {
    setZoom((currentZoom) =>
      Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentZoom + amount)),
    );
  };

  const handleWorkspaceWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.metaKey) return;

    event.preventDefault();
    setZoom((currentZoom) => {
      const nextZoom = currentZoom - event.deltaY * 0.01;
      return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
    });
  };

  const updateFromObject = (target: DesignTextbox) => {
    const id = target.dataElementId;
    if (!id) return;

    onElementChangeRef.current(id, {
      text: target.text,
      left: target.left ?? 0,
      top: target.top ?? 0,
      width: target.width,
      fontFamily: target.fontFamily ?? "Montserrat",
      fontSize: target.fontSize ?? 16,
      fontWeight: Number(target.fontWeight) || 400,
      fill: String(target.fill ?? "#111827"),
      fontStyle: target.fontStyle === "italic" ? "italic" : "normal",
      underline: Boolean(target.underline),
    });
  };

  useEffect(() => {
    if (!canvasElementRef.current || !canvasHostRef.current) return;
    const objectMap = objectsRef.current;

    const instance = new FabricCanvas(canvasElementRef.current, {
      selection: false,
      preserveObjectStacking: true,
      stopContextMenu: true,
    });

    fabricCanvasRef.current = instance;
    setFabricCanvas(instance);

    const handleSelection = (event: { selected?: FabricObject[] }) => {
      const target = event.selected?.[0];
      onSelectElementRef.current(getElementId(target) ?? null);
    };

    const handleCleared = () => onSelectElementRef.current(null);

    const handleDoubleClick = (event: {
      target?: FabricObject;
    }) => {
      const target = event.target;
      if (target instanceof IText) {
        instance.setActiveObject(target);
        target.enterEditing();
        target.hiddenTextarea?.focus();
      }
    };

    const handleTextChanged = (event: { target?: FabricObject }) => {
      if (event.target instanceof Textbox) {
        updateFromObject(event.target as DesignTextbox);
      }
    };

    const handleModified = (event: {
      target?: FabricObject;
      transform?: { corner?: string };
    }) => {
      const target = event.target;
      if (!(target instanceof Textbox)) return;

      const textbox = target as DesignTextbox;
      const scaleX = Math.abs(textbox.scaleX ?? 1);
      const scaleY = Math.abs(textbox.scaleY ?? 1);

      if (isCornerControl(event.transform?.corner) && scaleX !== 1) {
        const proportionalScale = Math.max(scaleX, scaleY);
        textbox.set({
          width: Math.max(2, (textbox.width ?? 2) * scaleX),
          fontSize: Math.max(1, (textbox.fontSize ?? 16) * proportionalScale),
          scaleX: 1,
          scaleY: 1,
        });
        textbox.initDimensions();
        textbox.setCoords();
      }

      updateFromObject(textbox);
      instance.requestRenderAll();
    };

    instance.on("selection:created", handleSelection);
    instance.on("selection:updated", handleSelection);
    instance.on("selection:cleared", handleCleared);
    instance.on("mouse:dblclick", handleDoubleClick);
    instance.on("text:changed", handleTextChanged);
    instance.on("object:modified", handleModified);

    return () => {
      instance.dispose();
      fabricCanvasRef.current = null;
      objectMap.clear();
    };
  }, []);

  useLayoutEffect(() => {
    const instance = fabricCanvasRef.current;
    const host = canvasHostRef.current;
    const viewport = viewportRef.current;
    if (!instance || !host || !viewport) return;

    const updateCanvasSize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      setBaseSize({ width, height });
      setViewportSize({
        width: viewport.clientWidth,
        height: viewport.clientHeight,
      });
      instance.setZoom(displayScale);
      instance.setDimensions({
        width: Math.max(1, width),
        height: Math.max(1, height),
      });
      // Keep the CSS canvas at the real paper dimensions, but render the
      // backing store at the visual scale to avoid blurry text after fitting.
      instance.setDimensions(
        {
          width: Math.max(1, Math.round(width * displayScale)),
          height: Math.max(1, Math.round(height * displayScale)),
        },
        { backstoreOnly: true },
      );
      instance.requestRenderAll();
    };

    updateCanvasSize();
    const observer = new ResizeObserver(updateCanvasSize);
    observer.observe(host);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [fabricCanvas, layoutSize.width, layoutSize.height, displayScale]);

  useEffect(() => {
    const instance = fabricCanvasRef.current;
    if (!instance || !canvasHostRef.current || !baseSize.width) return;

    const canvasWidth = baseSize.width;
    const canvasHeight = baseSize.height;
    const incomingIds = new Set(elements.map((element) => element.id));

    elements.forEach((element) => {
      let object = objectsRef.current.get(element.id);

      if (!object) {
        const isCentered = element.transform?.includes("translateX(-50%)");
        const initialWidth =
          element.width ?? Math.max(30, element.text.length * element.fontSize * 0.55);
        object = new Textbox(element.text, {
          left: resolveCoordinate(element.left, canvasWidth),
          top: resolveCoordinate(element.top, canvasHeight),
          width: initialWidth,
          originX: isCentered ? "center" : "left",
          originY: "top",
          fontFamily: element.fontFamily,
          fontSize: element.fontSize,
          fontWeight: element.fontWeight ?? 400,
          fill: element.fill,
          fontStyle: element.fontStyle,
          underline: element.underline,
          splitByGrapheme: true,
          editable: true,
          padding: 2,
          cornerSize: 8,
          cornerColor: "#2563eb",
          cornerStrokeColor: "#ffffff",
          borderColor: "#2563eb",
          borderScaleFactor: 1,
          transparentCorners: false,
          selectionBackgroundColor: "rgba(37, 99, 235, 0.10)",
        }) as DesignTextbox;
        object.dataElementId = element.id;
        objectsRef.current.set(element.id, object);
        instance.add(object);
      } else {
        object.set({
          text: element.text,
          fontFamily: element.fontFamily,
          fontSize: element.fontSize,
          fontWeight: element.fontWeight ?? 400,
          fill: element.fill,
          fontStyle: element.fontStyle,
          underline: element.underline,
          left: resolveCoordinate(element.left, canvasWidth),
          top: resolveCoordinate(element.top, canvasHeight),
          width: element.width ?? object.width,
        });
        object.initDimensions();
        object.setCoords();
      }
    });

    objectsRef.current.forEach((object, id) => {
      if (!incomingIds.has(id)) {
        instance.remove(object);
        objectsRef.current.delete(id);
      }
    });

    instance.requestRenderAll();
  }, [elements, fabricCanvas, baseSize.width, baseSize.height]);

  useEffect(() => {
    const instance = fabricCanvasRef.current;
    if (!instance) return;

    const target = selectedElementId
      ? objectsRef.current.get(selectedElementId)
      : undefined;

    if (target) instance.setActiveObject(target);
    else instance.discardActiveObject();
    instance.requestRenderAll();
  }, [fabricCanvas, selectedElementId]);

  return (
    <div
      ref={viewportRef}
      className="relative flex h-full w-full items-start justify-start overflow-auto bg-gray-200 p-8"
      onClick={() => onSelectElement(null)}
      onWheel={handleWorkspaceWheel}
    >
      <div
        className="relative m-auto shrink-0"
        style={{
          width: baseSize.width ? baseSize.width * displayScale : undefined,
          height: baseSize.height ? baseSize.height * displayScale : undefined,
        }}
      >
        <div
          ref={canvasHostRef}
          className="relative origin-top-left overflow-hidden border border-gray-300 bg-white shadow-lg"
          style={{
            width: layoutSize.width,
            height: layoutSize.height,
            transform: `scale(${displayScale})`,
            transformOrigin: "top left",
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <canvas ref={canvasElementRef} className="block" />
        </div>
      </div>

      <div
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-gray-300 bg-white/95 p-1 shadow-md"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="h-7 w-7 rounded text-lg leading-none hover:bg-gray-100"
          onClick={() => changeZoom(-0.1)}
          aria-label="Diminuir zoom"
        >
          −
        </button>
        <button
          type="button"
          className="min-w-14 rounded px-2 py-1 text-xs font-medium hover:bg-gray-100"
          onClick={() => setZoom(1)}
          aria-label="Restaurar zoom"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          className="h-7 w-7 rounded text-lg leading-none hover:bg-gray-100"
          onClick={() => changeZoom(0.1)}
          aria-label="Aumentar zoom"
        >
          +
        </button>
      </div>
    </div>
  );
}
