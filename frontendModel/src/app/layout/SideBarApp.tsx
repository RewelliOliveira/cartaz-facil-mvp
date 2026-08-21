import { Link, useLocation } from "react-router-dom";
import { Menu, Home as HomeIcon, LayoutGrid, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "../../components/ui/sidebar";
import { NAV_ROUTES } from "../../routes/router-config";
import { Button } from "../../components/ui/button";

const menuItemsWithIcons = [
  {
    ...NAV_ROUTES.home,
    icon: HomeIcon,
  },
  {
    ...NAV_ROUTES.componentesProntos,
    icon: LayoutGrid,
  },
  {
    ...NAV_ROUTES.criarLayout,
    icon: Plus,
  },
];

export function SidebarApp() {
  const location = useLocation();
  const { open, toggleSidebar } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 py-2 px-1.5 h-12 w-full">
          <Button
            id="btn-sidebar-toggle"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            title={open ? "Fechar menu" : "Abrir menu"}
            className="h-8 w-8 shrink-0"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </Button>
          {open && (
            <span className="font-semibold text-base whitespace-nowrap truncate">
              Cartaz Fácil
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItemsWithIcons.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
