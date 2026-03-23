"use client";

import { useState, useTransition } from "react";
import { updateProductQuantity } from "@/lib/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type InventoryQuantityActionsProps = {
  productId: string;
  initialQuantity: number;
};

export function InventoryQuantityActions({
  productId,
  initialQuantity,
}: InventoryQuantityActionsProps) {
  const [quantity, setQuantity] = useState(String(initialQuantity));
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const nextQuantity = Number(quantity);
    setError("");

    startTransition(async () => {
      try {
        await updateProductQuantity(productId, nextQuantity);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not update quantity.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center justify-end gap-2">
        <Input
          type="number"
          min={0}
          step={1}
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          className="h-8 w-20 text-right"
        />
        <Button type="button" variant="outline" size="sm" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Qty"}
        </Button>
      </div>
      {error && <p className="text-right text-xs text-destructive">{error}</p>}
    </div>
  );
}
