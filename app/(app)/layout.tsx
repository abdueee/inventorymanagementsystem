import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { RealtimeProvider } from "@/components/realtime-provider";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar
        userName={session.user.name}
        userEmail={session.user.email}
        userRole={session.user.role}
      />
      <SidebarInset>
        <header className="flex h-16 items-center gap-3 border-b px-4 md:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">
              Welcome back, {session.user.name ?? session.user.email}
            </p>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <RealtimeProvider>{children}</RealtimeProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
