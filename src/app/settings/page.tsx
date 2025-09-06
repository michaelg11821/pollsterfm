import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { siteName } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import ThemeToggle from "../components/theme-toggle";

export const metadata: Metadata = {
  title: `Settings | ${siteName}`,
  description: `Your settings on ${siteName}.`,
};

async function Settings() {
  const token = await convexAuthNextjsToken();
  const user = await fetchQuery(api.user.currentUser, {}, { token });

  if (!user)
    return redirect(`/sign-in?redirectTo=${encodeURIComponent("/settings")}`);

  return (
    <main className="centered-main">
      <p>not yet</p>
      <ThemeToggle />
    </main>
  );
}

export default Settings;
