import BackLink from "@/app/components/layout/back-link";
import PageShell from "@/app/components/layout/page-shell";
import { affinities } from "@/lib/constants/affinities";
import { affinityDescriptions } from "@/lib/constants/affinity-descriptions";
import { SITE_NAME } from "@/lib/constants/site-info";
import { capitalize, getAffinityColor } from "@/lib/convex-utils";
import type { Affinity } from "@/lib/types/pollster";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AffinityItems from "./items";
import AffinityItemsSkeleton from "./items-skeleton";

type AffinityPageProps = {
  params: Promise<{ affinity: string }>;
};

function resolveAffinity(raw: string): Affinity | null {
  const normalized = decodeURIComponent(raw).toLowerCase();
  if (!(affinities as readonly string[]).includes(normalized)) return null;
  return normalized as Affinity;
}

export async function generateMetadata({
  params,
}: AffinityPageProps): Promise<Metadata> {
  const { affinity } = await params;
  const slug = resolveAffinity(affinity);

  if (!slug) redirect("/not-found");

  return {
    title: `${capitalize(slug)} | ${SITE_NAME}`,
    description: affinityDescriptions[slug],
  };
}

async function AffinityPage({ params }: AffinityPageProps) {
  const { affinity } = await params;
  const slug = resolveAffinity(affinity);

  if (!slug) redirect("/not-found");

  const gradientClass = getAffinityColor(slug);
  const description = affinityDescriptions[slug];

  return (
    <PageShell>
      <div className="mb-6">
        <BackLink href="/affinities" label="All affinities" />
      </div>

      <div className="border-border relative mb-8 overflow-hidden rounded-xl border">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-80`}
        />
        <div className="relative flex flex-col gap-3 p-8 md:p-12">
          <span className="text-muted-foreground text-sm tracking-wide uppercase">
            Affinity
          </span>
          <h1 className="text-3xl font-bold capitalize">{capitalize(slug)}</h1>
          <p className="text-foreground/80 max-w-2xl">{description}</p>
        </div>
      </div>

      <Suspense fallback={<AffinityItemsSkeleton />}>
        <AffinityItems affinity={slug} />
      </Suspense>
    </PageShell>
  );
}

export default AffinityPage;
