"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        callbackURL: "/dashboard",
      }
    });
    return { user: result.user, error: null };
  } catch {
    return { user: null, error: "Failed to create account." };
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: "/dashboard",
      }
    });
    return { user: result.user, error: null };
  } catch {
    return { user: null, error: "Invalid email or password." };
  }
}

export const signOut = async () => {
  const result = await auth.api.signOut({
    headers: await headers()
  });
  return result;
}