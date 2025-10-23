"use client";

import { TRENDING_VOTE_COUNT } from "@/lib/constants/polls";
import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import { TrendingUp, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import PopularPollsSkeleton from "./skeleton";

function PopularPolls() {
  const popularPolls = useQuery(api.pollster.poll.getPopularPolls);

  if (popularPolls === undefined) return <PopularPollsSkeleton />;

  if (popularPolls === null || popularPolls.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-muted-foreground mb-4">
          <TrendingUp className="mx-auto mb-4 h-12 w-12" />
          <p className="text-lg">No popular polls found</p>
          <p className="text-sm">Check back later for trending polls</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {popularPolls?.map((poll, i) => {
        const affinities = Array.from(
          new Set(poll.choices.flatMap((choice) => choice.affinities)),
        );

        return (
          <Card
            key={i}
            className="hover:bg-accent max-h-112.5 cursor-pointer transition-[background-color]"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                {poll.question}
                {poll.totalVotes > TRENDING_VOTE_COUNT && (
                  <Badge variant="default">
                    <span className="bg-primary h-2 w-2 rounded-full"></span>
                    HOT
                  </Badge>
                )}
              </CardTitle>
              <div className="my-1 flex flex-wrap gap-2">
                {affinities.slice(0, 3).map((affinity, j) => (
                  <Badge key={j} variant="secondary">
                    {affinity}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="-mt-5">
              <div className="text-muted-foreground flex items-center text-sm">
                <Users className="mr-1 h-5 w-5" />
                <span>{poll.totalVotes} votes</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default PopularPolls;
