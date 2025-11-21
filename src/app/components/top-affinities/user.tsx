"use client";

import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import TopAffinitiesSkeleton from "./skeleton";

type TopUserAffinitiesProps = {
  username: string;
};

function TopUserAffinities({ username }: TopUserAffinitiesProps) {
  const userAffinities = useQuery(api.user.getAffinities, {
    amount: 6,
    username,
  });

  if (userAffinities === undefined) {
    return <TopAffinitiesSkeleton />;
  }

  if (userAffinities === null) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="mb-0 flex items-center justify-between">
        <h2 className="text-xl font-bold">Affinities</h2>
        <Link
          href="/affinities"
          className={buttonVariants({ variant: "ghost" })}
        >
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {userAffinities.map((affinity, i) => (
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

export default TopUserAffinities;
