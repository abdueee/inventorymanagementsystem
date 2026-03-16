import prisma from "@/lib/prisma";

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    include: { category: true, location: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Inventory</h1>
        <p className="text-sm text-muted-foreground">
          Browse the products you are currently tracking and their stock levels.
        </p>
      </div>

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">SKU</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Location</th>
              <th className="px-4 py-2 font-medium text-right">Qty</th>
              <th className="px-4 py-2 font-medium text-right">Price</th>
              <th className="px-4 py-2 font-medium text-right">Reorder At</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const lowStock = product.quantity <= product.reorderThreshold;
              return (
                <tr
                  key={product.id}
                  className={`border-t ${lowStock ? "bg-red-50 dark:bg-red-950/20" : ""}`}
                >
                  <td className="px-4 py-2 font-medium">{product.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{product.sku}</td>
                  <td className="px-4 py-2">{product.category.name}</td>
                  <td className="px-4 py-2">{product.location.name}</td>
                  <td className={`px-4 py-2 text-right ${lowStock ? "text-red-600 font-semibold" : ""}`}>
                    {product.quantity}
                  </td>
                  <td className="px-4 py-2 text-right">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right text-muted-foreground">{product.reorderThreshold}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
