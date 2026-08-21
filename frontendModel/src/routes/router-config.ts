export const NAV_ROUTES = {
  home: {
    title: "Início",
    url: "/",
  },
  componentesProntos: {
    title: "Galeria de Layouts",
    url: "/galeria",
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
  NAV_ROUTES.home,
  NAV_ROUTES.componentesProntos,
  NAV_ROUTES.criarLayout,
];
