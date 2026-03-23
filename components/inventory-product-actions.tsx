"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteProduct } from "@/lib/actions/product-actions";
import { Button } from "@/components/ui/button";

type InventoryProductActionsProps = {
  productId: string;
};

export function InventoryProductActions({ productId }: InventoryProductActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        await deleteProduct(productId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not delete product.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex justify-end gap-2">
        <Button asChild variant="outline" size="icon-sm">
          <Link href={`/inventory/${productId}/edit`} aria-label="Edit product" title="Edit product">
            <Pencil />
          </Link>
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          onClick={handleDelete}
          disabled={isPending}
          aria-label={isPending ? "Deleting product" : "Delete product"}
          title={isPending ? "Deleting product" : "Delete product"}
        >
          <Trash2 />
        </Button>
      </div>
      {error && <p className="text-right text-xs text-destructive">{error}</p>}
    </div>
  );
}
