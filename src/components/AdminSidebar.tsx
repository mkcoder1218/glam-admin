import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Scissors,
  Tag,
  Coins,
  UserCircle,
  UserCheck2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "Bookings", url: "/bookings", icon: Calendar },
  { title: "Services", url: "/services", icon: Scissors },
  { title: "Role Manager", url: "/roleaccess", icon: UserCheck2 },
  { title: "Promo Codes", url: "/promo-codes", icon: Tag },
  { title: "Coins", url: "/coins", icon: Coins },
  { title: "Gallery management", url: "/gallery", icon: Coins },
];

export const AdminSidebar = () => {
  const { state, openMobile, setOpenMobile } = useSidebar();

  return (
    <>
      <Sidebar collapsible="offcanvas" side="left">
        {/* Header (logo + collapse button) */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {state !== "collapsed" && (
            <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Glam Nest Admin
            </h2>
          )}
        </div>

        <SidebarContent>
          {/* ---------- MANAGEMENT ---------- */}
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "hover:bg-sidebar-accent/50"
                          }`
                        }
                        // Close mobile drawer after navigation
                        onClick={(e) => {
                          openMobile && setOpenMobile(false)}}
                      >
                        <item.icon className="h-4 w-4" />
                        {state !== "collapsed" && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* ---------- ACCOUNT ---------- */}
          <SidebarGroup className="mt-auto pb-4">
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "hover:bg-sidebar-accent/50"
                        }`
                      }
                      onClick={() => openMobile && setOpenMobile(false)}
                    >
                      <UserCircle className="h-4 w-4" />
                      {state !== "collapsed" && <span>Profile</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Backdrop – only on mobile */}
      {openMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}
    </>
  );
};