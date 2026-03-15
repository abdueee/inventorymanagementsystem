import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/sign-up-form";
import { auth } from "@/lib/auth";

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  return <SignUpForm />;
}
