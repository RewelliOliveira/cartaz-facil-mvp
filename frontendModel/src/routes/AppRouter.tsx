import { Routes, Route } from "react-router-dom";
import { NAV_ROUTES } from "./router-config";
import { ComponentesProntos } from "../app/features/ComponentesProntos/ComponentesProntos";
import { CriarLayout } from "../app/features/CriarLayout/CriarLayout";
import { LayoutDesign } from "../app/features/LayoutDesign/LayoutDesign";

export function AppRoutes() {
  return (
    <Routes>
      <Route path={NAV_ROUTES.componentesProntos.url} element={<ComponentesProntos />} />
      <Route path={NAV_ROUTES.criarLayout.url} element={<CriarLayout />} />
      <Route path={NAV_ROUTES.layoutDesign.url} element={<LayoutDesign />} />
    </Routes>
  );
}
