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
  LogOut,
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
import { useAuth } from "@/hooks/AuthContext";

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
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    console.log("User logged out");
  };

  return (
    <>
      <Sidebar collapsible="offcanvas" side="left" className="!z-[9999]">
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
                    <NavLink
                      to={item.url}
                      end
                      onClick={() => openMobile && setOpenMobile(false)}
                      className="w-full"
                    >
                      {({ isActive }) => (
                        <SidebarMenuButton asChild isActive={isActive}>
                          <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            {state !== "collapsed" && <span>{item.title}</span>}
                          </div>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
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
                {/* Profile */}
                <SidebarMenuItem>
                  <NavLink
                    to="/profile"
                    onClick={() => openMobile && setOpenMobile(false)}
                    className="w-full"
                  >
                    {({ isActive }) => (
                      <SidebarMenuButton asChild isActive={isActive}>
                        <div className="flex items-center gap-3">
                          <UserCircle className="h-4 w-4" />
                          {state !== "collapsed" && <span>Profile</span>}
                        </div>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>

                {/* Logout */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild onClick={handleLogout}>
                    <div className="flex items-center gap-3 cursor-pointer">
                      <LogOut className="h-4 w-4" />
                      {state !== "collapsed" && <span>Logout</span>}
                    </div>
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
