"use client";

import SectionHeader from "../layout/section-header";
import { Card, CardContent, CardHeader } from "../ui/card";
import TopAffinitiesSkeleton from "./skeleton";

type AffinityEntry = {
  name: string;
  score: number;
};

type TopAffinitiesBaseProps = {
  affinities: AffinityEntry[] | null | undefined;
  viewAllHref?: string;
};

function TopAffinitiesBase({
  affinities,
  viewAllHref = "/affinities",
}: TopAffinitiesBaseProps) {
  if (affinities === undefined) {
    return <TopAffinitiesSkeleton />;
  }

  if (affinities === null) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="mb-0">
        <SectionHeader
          variant="sidebar"
          title="Affinities"
          action={{ label: "View All", href: viewAllHref }}
        />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {affinities.map((affinity, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-muted-foreground">{affinity.name}</span>
                <span className="text-primary text-sm font-medium">
                  {affinity.score}%
                </span>
              </div>
              <div className="bg-foreground/10 h-2 overflow-hidden rounded-full font-medium">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${affinity.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TopAffinitiesBase;
