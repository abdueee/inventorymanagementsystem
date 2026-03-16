"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sku = formData.get("sku") as string;
  const categoryId = formData.get("categoryId") as string;
  const locationId = formData.get("locationId") as string;
  const quantity = parseInt(formData.get("quantity") as string) || 0;
  const price = parseFloat(formData.get("price") as string) || 0;
  const reorderThreshold = parseInt(formData.get("reorderThreshold") as string) || 10;

  // TODO: get actual user ID from session
  // For now, use the first user in the database
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No user found");

  await prisma.product.create({
    data: {
      name,
      description,
      sku,
      categoryId,
      locationId,
      quantity,
      price,
      reorderThreshold,
      createdById: user.id,
    },
  });

  revalidatePath("/inventory");
}
