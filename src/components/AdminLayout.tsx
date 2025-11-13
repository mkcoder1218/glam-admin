import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Menu } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider
      // Desktop: open by default
      // Mobile (<md): closed by default (handled automatically by shadcn)
      defaultOpen={true}
    >
      <div className="flex min-h-screen w-full bg-background">
        {/* ---------- SIDEBAR ---------- */}
        <AdminSidebar />

        {/* ---------- MAIN CONTENT ---------- */}
        <div className="flex flex-1 flex-col">
          {/* Mobile-only top bar with trigger */}
          <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background px-4 md:hidden">
            <SidebarTrigger className="flex h-10 w-10 items-center justify-center rounded-md border">
              <Menu className="h-10 w-10" />
            </SidebarTrigger>

            <span className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
              Glam Nest
            </span>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
