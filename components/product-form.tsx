"use client";

import { createProduct, updateProduct } from "@/lib/actions/product-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterOption = {
  id: string;
  name: string;
};

type ProductFormProps = {
  categories: FilterOption[];
  locations: FilterOption[];
  mode: "create" | "edit";
  productId?: string;
  initialValues?: {
    name: string;
    description: string;
    sku: string;
    categoryId: string;
    locationId: string;
    quantity: number;
    price: number;
    reorderThreshold: number;
  };
};

const defaultValues = {
  name: "",
  description: "",
  sku: "",
  categoryId: "",
  locationId: "",
  quantity: 0,
  price: 0,
  reorderThreshold: 10,
};

export function ProductForm({
  categories,
  locations,
  mode,
  productId,
  initialValues = defaultValues,
}: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");

  const isEdit = mode === "edit";

  async function handleSubmit(formData: FormData) {
    setError("");

    try {
      if (isEdit) {
        if (!productId) {
          throw new Error("Missing product id.");
        }

        await updateProduct(productId, formData);
      } else {
        await createProduct(formData);
      }

      router.push("/inventory");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Product" : "New Product"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Update the details for this inventory item."
            : "Fill in the details for the new inventory item."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Product name"
              defaultValue={initialValues.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="Optional description"
              defaultValue={initialValues.description}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              name="sku"
              placeholder="e.g. ELEC-007"
              defaultValue={initialValues.sku}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select name="categoryId" defaultValue={initialValues.categoryId} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationId">Location</Label>
            <Select name="locationId" defaultValue={initialValues.locationId} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                defaultValue={initialValues.quantity}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={initialValues.price}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reorderThreshold">Reorder At</Label>
              <Input
                id="reorderThreshold"
                name="reorderThreshold"
                type="number"
                defaultValue={initialValues.reorderThreshold}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            {isEdit ? "Save Changes" : "Add Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
