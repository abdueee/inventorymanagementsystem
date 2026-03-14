"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BarChart3, Boxes, Package } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const isSignedIn = Boolean(session?.user);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <div className="min-h-screen px-6 py-16 lg:py-24 flex items-center">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-2 items-center">
        {/* left side */}
        <div className="flex flex-col space-y-8 w-full max-w-lg">
          <h1 className="text-7xl lg:text-6xl font-bold">
            Stay stocked <br /> and in control
          </h1>
          <p className="text-xl text-slate-600 max-w-md">
            Track products, catch low stock early, and keep orders moving from
            one simple inventory dashboard.
          </p>
          <div className="flex gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="bg-black px-8 h-12 rounded-lg text-md"
            >
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                {isSignedIn ? "Go to dashboard" : "Get started for free"}{" "}
                <ArrowRight />
              </Link>
            </Button>
            {isSignedIn ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="px-8 h-12 rounded-lg text-md"
                onClick={handleSignOut}
              >
                Log out
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 h-12 rounded-lg text-md"
              >
                <Link href="/sign-in">Log in</Link>
              </Button>
            )}
          </div>
        </div>

        {/* right side */}
        <div className="w-full max-w-md border border-slate-200 rounded-xl shadow-sm">
          <div className="bg-black p-6 text-white">
            <div className="flex justify-between">
              <h3 className="text-2xl font-bold">Trackventory</h3>
            </div>
            <p className="text-s text-slate-400">128 SKUs • 6 low stock</p>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-6 p-4">
              <Package className="w-6 h-6 text-slate-400" />
              <div>
                <p className="text-s font-bold text-slate-900">
                  Wireless Mouse
                </p>
                <p className="text-xs text-slate-500">84 units in stock</p>
              </div>
            </div>

            <div className="flex items-center gap-6 p-4">
              <Boxes className="w-6 h-6 text-slate-400" />
              <div>
                <p className="text-s font-bold text-slate-900">
                  Shipping Labels
                </p>
                <p className="text-xs text-slate-500">
                  12 left • Reorder today
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 p-4">
              <BarChart3 className="w-6 h-6 text-slate-400" />
              <div>
                <p className="text-s font-bold text-slate-900">This week</p>
                <p className="text-xs text-slate-500">
                  42 units sold • 18 restocked
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
