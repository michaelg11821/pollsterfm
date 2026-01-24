"use client";

import { getChoiceItemName } from "@/lib/convex-utils";
import { api } from "@/lib/convex/_generated/api";
import type { Affinity } from "@/lib/types/pollster";
import { useQuery } from "convex/react";
import { TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "../ui/badge";
import HeroPollSkeleton from "./skeleton";

function HeroPoll() {
  const poll = useQuery(api.pollster.poll.getMostPopularPoll);
  const authorData = useQuery(api.user.getProfileById, {
    userId: poll?.authorId,
  });

  const uniqueAffinities = useMemo(() => {
    if (!poll) return [];
    return Array.from(
      new Set(
        poll.choices.flatMap((choice) => choice.affinities as Affinity[]),
      ),
    );
  }, [poll]);

  if (poll === undefined || authorData === undefined)
    return <HeroPollSkeleton />;

  if (poll === null || authorData === null) {
    return (
      <div className="bg-card border-border flex flex-col items-center justify-center rounded-xl border p-8 text-center shadow-xl sm:p-12">
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
    <>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-muted-foreground text-sm font-medium">
          Most popular poll
        </h2>
        <Link
          href="/polls"
          className="text-muted-foreground hover:text-foreground group flex items-center gap-1 text-sm transition-colors"
        >
          See all
          <svg
            className="relative ml-1 h-2.5 w-2.5 overflow-visible transition-transform duration-150 ease-out group-hover:translate-x-1"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              className="opacity-0 transition-opacity duration-0 ease-out group-hover:opacity-100"
              d="M-6 5h10"
            />
            <path d="M1 1l4 4-4 4" />
          </svg>
        </Link>
      </div>
      <div className="relative w-full overflow-hidden">
        <div className="from-primary/20 via-primary/5 pointer-events-none absolute -top-8 right-0 h-64 w-64 rounded-full bg-gradient-to-br to-transparent opacity-50 blur-3xl" />

        <div className="bg-card border-border relative w-full overflow-hidden rounded-xl border shadow-xl">
          <div className="border-border flex items-center gap-3 border-b px-4 py-4 sm:px-5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="bg-background relative m-0 flex h-10 w-10 items-center justify-center gap-1.5 rounded-full border-none outline-0 focus:outline-2 focus:outline-offset-2">
                {authorData.image && (
                  <Image
                    src={authorData.image}
                    alt=""
                    fill
                    className="rounded-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold">{poll.question}</h3>
                <p className="text-muted-foreground truncate text-xs">
                  by @{authorData.username} • {poll.totalVotes.toLocaleString()}{" "}
                  vote
                  {poll.totalVotes <= 0 || poll.totalVotes > 1 ? "s " : " "}
                </p>
              </div>
            </div>
            <span className="bg-primary/10 text-primary shrink-0 rounded-full px-2 py-0.5 text-xs font-medium">
              Live
            </span>
          </div>

          <div className="space-y-3 p-4 sm:p-5">
            {choicesWithPercentage.slice(0, 4).map((choice, i) => (
              <div key={i} className="relative min-w-0">
                <div className="border-border relative overflow-hidden rounded-lg border p-3">
                  <div
                    className="bg-primary/10 absolute inset-y-0 left-0"
                    style={{ width: `${choice.pct}%` }}
                  />
                  <div className="relative flex min-w-0 items-center gap-2 sm:gap-3">
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
            <div className="border-border flex flex-wrap items-center gap-2 overflow-hidden px-4 pt-0 pb-3 sm:px-5">
              <p className="text-muted-foreground shrink-0 text-xs">
                Affinities:
              </p>
              {uniqueAffinities.slice(0, 5).map((affinity) => (
                <Badge
                  key={affinity}
                  variant="secondary"
                  className="max-w-[120px] truncate text-xs"
                >
                  {affinity}
                </Badge>
              ))}
              {uniqueAffinities.length > 5 && (
                <Badge variant="outline" className="shrink-0 text-xs">
                  +{uniqueAffinities.length - 5}
                </Badge>
              )}
            </div>
          )}

          <div className="border-border bg-muted/30 flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs sm:gap-4">
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
    </>
  );
}

export default HeroPoll;
