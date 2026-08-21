import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { LayoutTemplate } from "../types/layout";
import { MOCK_TEMPLATES } from "../constants/mockData";

const STORAGE_KEY = "cartaz_facil_custom_templates";

function loadCustomTemplates(): LayoutTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LayoutTemplate[]) : [];
  } catch {
    return [];
  }
}

function persistCustomTemplates(templates: LayoutTemplate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

type LayoutsContextValue = {
  templates: LayoutTemplate[];
  saveTemplate: (template: LayoutTemplate) => void;
  deleteCustomTemplate: (id: string) => void;
};

const LayoutsContext = createContext<LayoutsContextValue | null>(null);

export function LayoutsProvider({ children }: { children: ReactNode }) {
  const [customTemplates, setCustomTemplates] = useState<LayoutTemplate[]>(loadCustomTemplates);

  const allTemplates = [
    ...MOCK_TEMPLATES,
    ...customTemplates,
  ];

  const saveTemplate = useCallback((template: LayoutTemplate) => {
    const marked = { ...template, isCustom: true };
    setCustomTemplates((prev) => {
      const exists = prev.some((t) => t.id === marked.id);
      const next = exists
        ? prev.map((t) => (t.id === marked.id ? marked : t))
        : [...prev, marked];
      persistCustomTemplates(next);
      return next;
    });
  }, []);

  const deleteCustomTemplate = useCallback((id: string) => {
    setCustomTemplates((prev) => {
      const next = prev.filter((t) => t.id !== id);
      persistCustomTemplates(next);
      return next;
    });
  }, []);

  return (
    <LayoutsContext.Provider value={{ templates: allTemplates, saveTemplate, deleteCustomTemplate }}>
      {children}
    </LayoutsContext.Provider>
  );
}

export function useLayouts(): LayoutsContextValue {
  const ctx = useContext(LayoutsContext);
  if (!ctx) throw new Error("useLayouts must be used inside <LayoutsProvider>");
  return ctx;
}
