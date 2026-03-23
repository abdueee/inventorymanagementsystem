import { auth } from "@/lib/auth";
import { ProductForm } from "@/components/product-form";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/inventory");
  }

  const { id } = await params;

  const [categories, locations, product] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findUnique({
      where: { id },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Edit Product</h1>
        <p className="text-sm text-muted-foreground">
          Update this item and return to the inventory list when you are done.
        </p>
      </div>
      <ProductForm
        mode="edit"
        productId={product.id}
        categories={categories}
        locations={locations}
        initialValues={{
          name: product.name,
          description: product.description ?? "",
          sku: product.sku,
          categoryId: product.categoryId,
          locationId: product.locationId,
          quantity: product.quantity,
          price: product.price,
          reorderThreshold: product.reorderThreshold,
        }}
      />
    </div>
  );
}
