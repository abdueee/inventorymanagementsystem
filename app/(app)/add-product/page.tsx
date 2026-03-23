import prisma from "@/lib/prisma";
import { AddProductForm } from "./add-product-form";

export default async function AddProductPage() {
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
      <AddProductForm categories={categories} locations={locations} />
    </div>
  );
}
