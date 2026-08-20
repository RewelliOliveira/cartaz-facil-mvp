import { Routes, Route } from "react-router-dom";
import { NAV_ROUTES } from "./router-config";
import { LayoutDesign } from "../app/features/LayoutDesign/LayoutDesign";

export function AppRoutes() {
  return (
    <Routes>
      <Route path={NAV_ROUTES.layoutDesign.url} element={<LayoutDesign />} />
    </Routes>
  );
}
