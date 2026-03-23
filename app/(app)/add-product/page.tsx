import { auth } from "@/lib/auth";
import { ProductForm } from "@/components/product-form";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AddProductPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/inventory");
  }

  const [categories, locations] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Add Product</h1>
        <p className="text-sm text-muted-foreground">
          Use this space to add the details for a new inventory item.
        </p>
      </div>
      <ProductForm mode="create" categories={categories} locations={locations} />
    </div>
  );
}
