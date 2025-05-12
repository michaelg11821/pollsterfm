import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { siteName } from "@/config";
import ProviderLogins from "../components/provider-logins/provider-logins";

export const metadata: Metadata = {
  title: `Sign In | ${siteName}`,
  description: `Sign in to ${siteName}`,
};

async function SignIn() {
  const session = await auth();

  const user = session?.user;

  if (user) return redirect("/profile");

  return (
    <main className="centered-main">
      <ProviderLogins />
    </main>
  );
}

export default SignIn;
