import { Link, useLocation } from "react-router-dom";
import LogoBV from "@/assets/LogoBV.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "../../components/ui/sidebar";
import { menuItems } from "../../routes/router-config";

export function SidebarApp() {
  const location = useLocation();

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center gap-3 py-2 px-4 h-12 w-full">
          <img src={LogoBV} alt="LogoBV" className="w-10" />
          <span className="font-semibold text-lg whitespace-nowrap">
            Cartaz Facil
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  isActive={location.pathname === item.url}
                  tooltip={item.title}
                >
                  <Link to={item.url}>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
