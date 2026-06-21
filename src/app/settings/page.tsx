import type { Metadata } from "next";
import { redirect } from "next/navigation";

import PageShell from "@/app/components/layout/page-shell";
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
    <PageShell>
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <SettingsContent />
      </div>
    </PageShell>
  );
}

export default Settings;
