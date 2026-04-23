import ItemGrid from "@/app/components/layout/item-grid";
import PageShell from "@/app/components/layout/page-shell";
import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import AffinityCard from "../components/affinity-card/affinity-card";

export const metadata: Metadata = {
  title: `Affinities | ${SITE_NAME}`,
  description: "Browse all available affinities on Pollster.fm",
};

async function AffinitiesPage() {
  const token = await convexAuthNextjsToken();
  const affinities = await fetchQuery(
    api.pollster.affinity.getAffinities,
    {},
    { token },
  );

  return (
    <PageShell>
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl font-bold">All affinities</h1>
        <p className="text-muted-foreground">
          Explore all {affinities.length} available affinities that help
          describe your music taste
        </p>
      </div>
      <ItemGrid density="compact" gap="sm">
        {affinities.map((affinity, i) => (
          <AffinityCard key={`affinity-card-${i}`} affinity={affinity} />
        ))}
      </ItemGrid>
    </PageShell>
  );
}

export default AffinitiesPage;
