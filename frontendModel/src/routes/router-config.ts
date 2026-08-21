export const NAV_ROUTES = {
  componentesProntos: {
    title: "Galeria de Layouts",
    url: "/",
  },
  criarLayout: {
    title: "Criar Layout",
    url: "/criar-layout",
  },
  layoutDesign: {
    title: "Editor de Layout",
    url: "/layout-design",
  },
} as const;

export const menuItems = [
  NAV_ROUTES.componentesProntos,
  NAV_ROUTES.criarLayout,
];
