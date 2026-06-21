import BackLink from "@/app/components/layout/back-link";
import PageShell from "@/app/components/layout/page-shell";
import ListeningHistoryImport from "@/app/components/listening-history-import/listening-history-import";
import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `Import Listening History | ${SITE_NAME}`,
  description: `Import your Spotify listening history on ${SITE_NAME}.`,
};

async function ImportHistoryPage() {
  const token = await convexAuthNextjsToken();

  const [user, paymentStatus] = await Promise.all([
    fetchQuery(api.user.currentUser, {}, { token }),
    fetchQuery(api.stripe.getPaymentStatus, {}, { token }),
  ]);

  if (!user) {
    return redirect(
      `/sign-in?redirectTo=${encodeURIComponent("/settings/import-history")}`,
    );
  }

  if (!paymentStatus.hasPaid) {
    return redirect("/settings");
  }

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="space-y-4">
          <BackLink href="/settings" label="Back to settings" />
          <h1 className="text-3xl font-bold">Import listening history</h1>
        </div>

        <ListeningHistoryImport />
      </div>
    </PageShell>
  );
}

export default ImportHistoryPage;
