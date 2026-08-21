export const NAV_ROUTES = {
  home: {
    title: "Início",
    url: "/",
  },
  cartazUnitario: {
    title: "Cartaz Unitário",
    url: "/cartaz-unitario",
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
  NAV_ROUTES.cartazUnitario,
  NAV_ROUTES.componentesProntos,
  NAV_ROUTES.criarLayout,
];
