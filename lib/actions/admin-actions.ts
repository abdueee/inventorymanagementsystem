"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type SettingsRedirectParams = {
  error?: string;
  status?: string;
};

function redirectToSettings(params: SettingsRedirectParams = {}): never {
  const searchParams = new URLSearchParams();

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.error) {
    searchParams.set("error", params.error);
  }

  const query = searchParams.toString();
  redirect(query ? `/settings?${query}` : "/settings");
}

async function requireAdminContext() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return { requestHeaders, session };
}

export async function setManagedUserRole(formData: FormData) {
  const { requestHeaders, session } = await requireAdminContext();
  const userIdValue = formData.get("userId");
  const role = formData.get("role");

  if (typeof userIdValue !== "string") {
    redirectToSettings({ error: "missing-fields" });
  }

  const userId = userIdValue.trim();

  if (!userId) {
    redirectToSettings({ error: "missing-fields" });
  }

  if (role !== "admin" && role !== "user") {
    redirectToSettings({ error: "invalid-role" });
  }

  if (session.user.id === userId && role !== "admin") {
    redirectToSettings({ error: "cannot-demote-self" });
  }

  try {
    await auth.api.setRole({
      body: {
        userId,
        role,
      },
      headers: requestHeaders,
    });
  } catch {
    redirectToSettings({ error: "role-update-failed" });
  }

  revalidatePath("/settings");
  redirectToSettings({ status: "role-updated" });
}

export async function deleteManagedUser(formData: FormData) {
  const { requestHeaders, session } = await requireAdminContext();
  const userIdValue = formData.get("userId");

  if (typeof userIdValue !== "string") {
    redirectToSettings({ error: "missing-fields" });
  }

  const userId = userIdValue.trim();

  if (!userId) {
    redirectToSettings({ error: "missing-fields" });
  }

  if (session.user.id === userId) {
    redirectToSettings({ error: "cannot-delete-self" });
  }

  try {
    await auth.api.removeUser({
      body: {
        userId,
      },
      headers: requestHeaders,
    });
  } catch {
    redirectToSettings({ error: "delete-user-failed" });
  }

  revalidatePath("/settings");
  redirectToSettings({ status: "user-deleted" });
}
