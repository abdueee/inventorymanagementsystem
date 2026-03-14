"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  LayoutDashboard,
  LogOut,
  Package2,
  PlusSquare,
  Settings,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package2,
  },
  {
    title: "Add Product",
    href: "/add-product",
    icon: PlusSquare,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

type AppSidebarProps = {
  userName?: string | null;
  userEmail?: string | null;
};

export function AppSidebar({ userName, userEmail }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="dark bg-sidebar text-sidebar-foreground"
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="Trackventory">
              <Link href="/dashboard">
                <Boxes className="size-5" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Trackventory</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {userName ?? "Inventory workspace"}
                  </span>
                  <span className="truncate text-xs">
                    {userEmail ?? "Signed in"}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
            <SidebarMenuAction
              onClick={handleSignOut}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut />
            </SidebarMenuAction>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
