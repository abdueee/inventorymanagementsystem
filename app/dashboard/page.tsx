import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
    </main>
  );
}