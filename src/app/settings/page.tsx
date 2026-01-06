import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import SettingsContent from "./settings-content";

export const metadata: Metadata = {
  title: `Settings | ${SITE_NAME}`,
  description: `Your settings on ${SITE_NAME}.`,
};

async function Settings() {
  const token = await convexAuthNextjsToken();
  const user = await fetchQuery(api.user.currentUser, {}, { token });

  if (!user)
    return redirect(`/sign-in?redirectTo=${encodeURIComponent("/settings")}`);

  return (
    <main className="centered-main">
      <div className="w-full max-w-lg space-y-6 px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <SettingsContent />
      </div>
    </main>
  );
}

export default Settings;
