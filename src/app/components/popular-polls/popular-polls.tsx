"use client";

import { TRENDING_VOTE_COUNT } from "@/lib/constants/polls";
import { api } from "@/lib/convex/_generated/api";
import { cn } from "@/lib/next-utils";
import { useQuery } from "convex/react";
import { Flame, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import PopularPollsSkeleton from "./skeleton";

function PopularPolls() {
  const popularPolls = useQuery(api.pollster.poll.getPopularPolls);

  if (popularPolls === undefined) return <PopularPollsSkeleton />;

  if (popularPolls === null || popularPolls.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-muted-foreground">
          <div className="bg-accent mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl">
            <TrendingUp className="h-10 w-10" />
          </div>
          <p className="mb-2 text-xl font-semibold">No popular polls yet</p>
          <p className="text-sm">Check back later for trending polls</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {popularPolls?.map((poll, i) => {
        const affinities = Array.from(
          new Set(poll.choices.flatMap((choice) => choice.affinities)),
        );
        const isHot = poll.totalVotes > TRENDING_VOTE_COUNT;

        return (
          <Link href={`/polls/${poll._id}`} key={i}>
            <Card
              className={cn(
                "group relative h-full cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1",
                isHot
                  ? "border-primary/40 hover:border-primary"
                  : "hover:border-muted-foreground/50",
              )}
            >
              <CardHeader className="relative pb-3">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <CardTitle className="group-hover:text-primary line-clamp-2 text-lg leading-tight font-bold transition-colors">
                    {poll.question}
                  </CardTitle>
                  {isHot && (
                    <Badge variant="default" className="shrink-0 border-0">
                      <Flame className="mr-1 h-3 w-3" />
                      HOT
                    </Badge>
                  )}
                </div>

                {affinities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {affinities.slice(0, 3).map((affinity, j) => (
                      <Badge
                        key={j}
                        variant="secondary"
                        className="text-xs font-medium"
                      >
                        {affinity}
                      </Badge>
                    ))}
                    {affinities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{affinities.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">
                      {poll.totalVotes.toLocaleString()}
                    </span>
                    <span>vote{poll.totalVotes !== 1 ? "s" : ""}</span>
                  </div>
                </div>

                <div className="bg-accent mt-4 h-1.5 overflow-hidden rounded-full">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isHot ? "bg-primary" : "bg-primary/60",
                    )}
                    style={{
                      width: `${Math.min(100, (poll.totalVotes / TRENDING_VOTE_COUNT) * 100)}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default PopularPolls;
