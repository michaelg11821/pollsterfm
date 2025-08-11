"use client";

import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import TopAffinitiesSkeleton from "./skeleton";

type TopArtistAffinitiesProps = {
  artist: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TopArtistAffinities({ artist }: TopArtistAffinitiesProps) {
  // prereq(?) featured in section

  const temporaryAffinities = [
    { name: "Nostalgic", score: 92 },
    { name: "Atmospheric", score: 87 },
    { name: "Melancholic", score: 83 },
    { name: "Introspective", score: 78 },
    { name: "Ethereal", score: 76 },
    { name: "Warm", score: 71 },
  ];

  if (temporaryAffinities === undefined) {
    return <TopAffinitiesSkeleton />;
  }

  if (temporaryAffinities === null) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="mb-0 flex items-center justify-between">
        <h2 className="text-xl font-bold">Affinities</h2>
        <Link href="#" className={buttonVariants({ variant: "ghost" })}>
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {temporaryAffinities.map((affinity, i) => (
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

export default TopArtistAffinities;
