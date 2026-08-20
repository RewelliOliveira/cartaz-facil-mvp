import { SidebarApp } from "./SideBarApp";
import { AppRoutes } from "../../routes/AppRouter";
import { SidebarProvider } from "../../components/ui/sidebar";

export function Layout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50">
        <SidebarApp />
        <div className="flex flex-1 flex-col min-w-0 min-h-0 transition-all duration-300 ease-in-out">
          <main className="flex-1 flex flex-col relative min-h-0 overflow-y-auto">
            <AppRoutes />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
