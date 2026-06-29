import PageShell from "@/app/components/layout/page-shell";
import SectionHeader from "@/app/components/layout/section-header";
import PopularPolls from "@/app/components/popular-polls/popular-polls";
import RandomAffinities from "@/app/components/random-affinities/random-affinities";
import RandomAffinitiesSkeleton from "@/app/components/random-affinities/skeleton";
import { buttonVariants } from "@/app/components/ui/button";
import { SITE_NAME } from "@/lib/constants/site-info";
import { cn } from "@/lib/next-utils";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Discover | ${SITE_NAME}`,
  description:
    "Discover trending music polls and affinities on pollster.fm.",
};

function DiscoverPage() {
  return (
    <PageShell>
      <h1 className="mb-8 text-3xl font-bold">Discover</h1>

      <section className="mb-12">
        <SectionHeader
          title="Trending Polls"
          action={{ label: "Browse all polls", href: "/polls" }}
        />
        <PopularPolls />
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Popular Affinities"
          action={{ label: "View all affinities", href: "/affinities" }}
        />
        <Suspense fallback={<RandomAffinitiesSkeleton />}>
          <RandomAffinities amount={12} />
        </Suspense>
      </section>

      <section>
        <SectionHeader title="More Ways to Explore" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/reviews"
            className={cn(buttonVariants({ variant: "outline" }), "justify-center")}
          >
            Read Reviews
          </Link>
          <Link
            href="/create-poll"
            className={cn(buttonVariants({ variant: "outline" }), "justify-center")}
          >
            Create a Poll
          </Link>
          <Link
            href="/create-review"
            className={cn(buttonVariants({ variant: "outline" }), "justify-center")}
          >
            Write a Review
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

export default DiscoverPage;
