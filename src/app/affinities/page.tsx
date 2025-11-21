import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import AffinityCard from "../components/affinity-card/affinity-card";
import { Card, CardContent, CardHeader } from "../components/ui/card";

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
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold">All affinities</h1>
          <p className="text-muted-foreground">
            Explore all {affinities.length} available affinities that help
            describe your music taste
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {affinities.map((affinity, i) => (
              <AffinityCard key={`affinity-card-${i}`} affinity={affinity} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AffinitiesPage;
