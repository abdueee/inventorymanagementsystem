"use client";

import { createProduct } from "@/lib/actions/product-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FilterOption = { id: string; name: string };

export function AddProductForm({
  categories,
  locations,
}: {
  categories: FilterOption[];
  locations: FilterOption[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    try {
      await createProduct(formData);
      router.push("/inventory");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <form action={handleSubmit} className="max-w-lg space-y-4">
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <input id="name" name="name" required className="w-full rounded border px-3 py-2 text-sm" />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <input id="description" name="description" className="w-full rounded border px-3 py-2 text-sm" />
      </div>

      <div className="space-y-1">
        <label htmlFor="sku" className="text-sm font-medium">SKU</label>
        <input id="sku" name="sku" required className="w-full rounded border px-3 py-2 text-sm" />
      </div>

      <div className="space-y-1">
        <label htmlFor="categoryId" className="text-sm font-medium">Category</label>
        <select id="categoryId" name="categoryId" required className="w-full rounded border px-3 py-2 text-sm">
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="locationId" className="text-sm font-medium">Location</label>
        <select id="locationId" name="locationId" required className="w-full rounded border px-3 py-2 text-sm">
          <option value="">Select location</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
          <input id="quantity" name="quantity" type="number" defaultValue={0} required className="w-full rounded border px-3 py-2 text-sm" />
        </div>

        <div className="space-y-1">
          <label htmlFor="price" className="text-sm font-medium">Price</label>
          <input id="price" name="price" type="number" step="0.01" defaultValue={0} required className="w-full rounded border px-3 py-2 text-sm" />
        </div>

        <div className="space-y-1">
          <label htmlFor="reorderThreshold" className="text-sm font-medium">Reorder At</label>
          <input id="reorderThreshold" name="reorderThreshold" type="number" defaultValue={10} required className="w-full rounded border px-3 py-2 text-sm" />
        </div>
      </div>

      <button type="submit" className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-black/90">
        Add Product
      </button>
    </form>
  );
}
