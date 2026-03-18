"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user?.id) {
    throw new Error("You must be signed in to create a product.");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sku = formData.get("sku") as string;
  const categoryId = formData.get("categoryId") as string;
  const locationId = formData.get("locationId") as string;
  const quantity = parseInt(formData.get("quantity") as string) || 0;
  const price = parseFloat(formData.get("price") as string) || 0;
  const reorderThreshold = parseInt(formData.get("reorderThreshold") as string) || 10;

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
      createdById: session.user.id,
    },
  });

  revalidatePath("/inventory");
}
