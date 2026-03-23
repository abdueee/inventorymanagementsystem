import { auth } from "@/lib/auth";
import { InventoryProductActions } from "@/components/inventory-product-actions";
import { InventoryQuantityActions } from "@/components/inventory-quantity-actions";
import prisma from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { headers } from "next/headers";

export default async function InventoryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const products = await prisma.product.findMany({
    include: { category: true, location: true },
    orderBy: { name: "asc" },
  });
  const isAdmin = session?.user?.role === "admin";
  const canAdjustQuantity = session?.user?.role === "user";

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Inventory</h1>
        <p className="text-sm text-muted-foreground">
          Browse the products you are currently tracking and their stock levels.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>{products.length} items in inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Status</TableHead>
                {(isAdmin || canAdjustQuantity) && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const lowStock = product.quantity <= product.reorderThreshold;
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>{product.location.name}</TableCell>
                    <TableCell className="text-right">{product.quantity}</TableCell>
                    <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {lowStock ? (
                        <Badge variant="destructive">Low Stock</Badge>
                      ) : (
                        <Badge variant="secondary">In Stock</Badge>
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <InventoryProductActions productId={product.id} />
                      </TableCell>
                    )}
                    {canAdjustQuantity && (
                      <TableCell className="text-right">
                        <InventoryQuantityActions
                          productId={product.id}
                          initialQuantity={product.quantity}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
