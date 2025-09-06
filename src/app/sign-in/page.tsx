import type { Metadata } from "next";

import { siteName } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import ProviderLogins from "../components/provider-logins/provider-logins";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `Sign In | ${siteName}`,
  description: `Sign in to ${siteName}`,
};

async function SignIn() {
  const token = await convexAuthNextjsToken();
  const user = await fetchQuery(api.user.currentUser, {}, { token });

  if (user) return redirect(`/user/${user.username}`);

  return (
    <main className="centered-main">
      <ProviderLogins />
    </main>
  );
}

export default SignIn;
