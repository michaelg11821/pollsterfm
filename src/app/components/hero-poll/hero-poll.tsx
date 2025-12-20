"use client";

import { getChoiceItemName } from "@/lib/convex-utils";
import { api } from "@/lib/convex/_generated/api";
import type { Affinity } from "@/lib/types/pollster";
import { useQuery } from "convex/react";
import { TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import PollAuthorImage from "../poll/author-image/author-image";
import { Badge } from "../ui/badge";
import HeroPollSkeleton from "./skeleton";

function HeroPoll() {
  const poll = useQuery(api.pollster.poll.getMostPopularPoll);

  const uniqueAffinities = useMemo(() => {
    if (!poll) return [];
    return Array.from(
      new Set(
        poll.choices.flatMap((choice) => choice.affinities as Affinity[]),
      ),
    );
  }, [poll]);

  if (poll === undefined) return <HeroPollSkeleton />;

  if (poll === null) {
    return (
      <div className="bg-card border-border flex flex-col items-center justify-center rounded-xl border p-12 text-center shadow-xl">
        <div className="bg-accent mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
          <Users className="text-muted-foreground h-8 w-8" />
        </div>
        <p className="text-muted-foreground mb-2 text-lg font-medium">
          No polls yet
        </p>
        <p className="text-muted-foreground text-sm">
          Be the first to create one!
        </p>
      </div>
    );
  }

  const choicesWithPercentage = poll.choices.map((choice) => ({
    ...choice,
    name: getChoiceItemName(choice) || "Unknown",
    pct:
      poll.totalVotes > 0
        ? Math.round((choice.totalVotes / poll.totalVotes) * 100)
        : 0,
  }));

  return (
    <div className="relative">
      <div className="from-primary/20 via-primary/5 absolute -top-8 -right-8 h-64 w-64 rounded-full bg-gradient-to-br to-transparent blur-3xl" />

      <div className="bg-card border-border relative overflow-hidden rounded-xl border shadow-xl">
        <div className="border-border flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <PollAuthorImage username={poll.author} />
            <div>
              <h3 className="font-semibold">{poll.question}</h3>
              <p className="text-muted-foreground text-xs">
                by @{poll.author} • {poll.totalVotes.toLocaleString()} vote
                {poll.totalVotes <= 0 || poll.totalVotes > 1 ? "s " : " "}
              </p>
            </div>
          </div>
          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
            Live
          </span>
        </div>

        <div className="space-y-3 p-5">
          {choicesWithPercentage.slice(0, 4).map((choice, i) => (
            <div key={i} className="relative">
              <div className="border-border relative overflow-hidden rounded-lg border p-3">
                <div
                  className="bg-primary/10 absolute inset-y-0 left-0"
                  style={{ width: `${choice.pct}%` }}
                />
                <div className="relative flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-black/20">
                    <Image
                      src={choice.image}
                      alt=""
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {choice.name}
                  </span>
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {choice.pct}%
                  </span>
                </div>
              </div>
            </div>
          ))}
          {poll.choices.length > 4 && (
            <p className="text-muted-foreground text-center text-xs">
              +{poll.choices.length - 4} more options
            </p>
          )}
        </div>

        {uniqueAffinities.length > 0 && (
          <div className="border-border flex flex-wrap items-center gap-2 px-5 pt-0 pb-3">
            <p className="text-muted-foreground text-center text-xs">
              Affinities:
            </p>
            {uniqueAffinities.slice(0, 5).map((affinity) => (
              <Badge key={affinity} variant="secondary" className="text-xs">
                {affinity}
              </Badge>
            ))}
            {uniqueAffinities.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{uniqueAffinities.length - 5}
              </Badge>
            )}
          </div>
        )}

        <div className="border-border bg-muted/30 flex items-center justify-between border-t px-5 py-3">
          <div className="text-muted-foreground flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {poll.totalVotes.toLocaleString()} vote
              {poll.totalVotes <= 0 || poll.totalVotes > 1 ? "rs " : "r "}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Trending
            </span>
          </div>
          <Link
            href={`/polls/${poll._id}`}
            className="text-primary group flex items-center gap-1 text-xs font-medium"
          >
            Vote now
            <svg
              className="relative ml-1 h-2.5 w-2.5 overflow-visible transition-transform duration-150 ease-out group-hover:translate-x-1"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                className="opacity-0 transition-opacity duration-0 ease-out group-hover:opacity-100"
                d="M-6 5h10"
              />
              <path d="M1 1l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeroPoll;
