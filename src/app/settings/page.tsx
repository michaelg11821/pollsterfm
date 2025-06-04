import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { siteName } from "@/config";

export const metadata: Metadata = {
  title: `Settings | ${siteName}`,
  description: `Your settings on ${siteName}.`,
};

async function Settings() {
  const session = await auth();

  const user = session?.user;

  if (!user)
    return redirect(`/sign-in?redirectTo=${encodeURIComponent("/settings")}`);

  return (
    <main className="centered-main">
      <p>not yet</p>
    </main>
  );
}

export default Settings;
