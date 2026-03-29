"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { emitInventoryUpdate } from "@/lib/sse/emitter";

async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user?.id) {
    throw new Error("You must be signed in to manage inventory.");
  }

  return session;
}

async function requireAdminSession() {
  const session = await requireSession();

  if (session.user.role !== "admin") {
    throw new Error("Only admins can manage products.");
  }

  return session;
}

function getProductPayload(formData: FormData) {
  return {
    name: (formData.get("name") as string) ?? "",
    description: (formData.get("description") as string) ?? "",
    sku: (formData.get("sku") as string) ?? "",
    categoryId: (formData.get("categoryId") as string) ?? "",
    locationId: (formData.get("locationId") as string) ?? "",
    quantity: parseInt(formData.get("quantity") as string) || 0,
    price: parseFloat(formData.get("price") as string) || 0,
    reorderThreshold: parseInt(formData.get("reorderThreshold") as string) || 10,
  };
}

async function refreshProductViews() {
  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  await emitInventoryUpdate();
}

export async function createProduct(formData: FormData) {
  const session = await requireAdminSession();
  const product = getProductPayload(formData);

  await prisma.product.create({
    data: {
      ...product,
      createdById: session.user.id,
    },
  });

  await refreshProductViews();
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdminSession();
  const product = getProductPayload(formData);

  await prisma.product.update({
    where: { id: productId },
    data: product,
  });

  await refreshProductViews();
}

export async function deleteProduct(productId: string) {
  await requireAdminSession();

  await prisma.product.delete({
    where: { id: productId },
  });

  await refreshProductViews();
}

export async function updateProductQuantity(productId: string, quantity: number) {
  const session = await requireSession();

  if (session.user.role !== "admin" && session.user.role !== "user") {
    throw new Error("You do not have permission to update product quantity.");
  }

  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error("Quantity must be a whole number greater than or equal to 0.");
  }

  await prisma.product.update({
    where: { id: productId },
    data: { quantity },
  });

  await refreshProductViews();
}