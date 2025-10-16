"use client";

import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";

import { oneDayMs } from "@/lib/constants/time";
import { cn } from "@/lib/next-utils";
import type { Poll } from "@/lib/types/pollster";
import { TrendingUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import PollPreview from "../poll-preview/poll-preview";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import PollsSkeleton from "./skeleton";

const filterOptions = [
  { id: "all", label: "All Polls" },
  { id: "track", label: "Tracks" },
  { id: "album", label: "Albums" },
  { id: "artist", label: "Artists" },
  { id: "trending", label: "Trending" },
  { id: "recent", label: "Recent" },
];

function Polls() {
  const polls = useQuery(api.pollster.poll.getPolls);
  const searchParams = useSearchParams();
  const router = useRouter();

  if (polls === undefined) return <PollsSkeleton />;

  if (polls === null)
    return (
      <div className="py-12 text-center">
        <div className="text-muted-foreground mb-4">
          <TrendingUp className="mx-auto mb-4 h-12 w-12" />
          <p className="text-lg">No polls found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      </div>
    );

  const currentFilter = searchParams.get("filter");

  const filteredPolls = polls.filter((poll) => {
    if (currentFilter === "all" || currentFilter === null) return true;
    if (currentFilter === "trending") return poll.totalVotes > 10;
    if (currentFilter === "recent")
      return Date.now() - poll._creationTime < oneDayMs;

    return poll.pollType === currentFilter;
  });

  return (
    <div>
      <div className="mb-8">
        <Card className="p-6">
          <div className="flex flex-wrap justify-center gap-3">
            {filterOptions.map((filter) => (
              <Button
                key={filter.id}
                variant={
                  currentFilter === filter.id ||
                  (filter.label === filterOptions[0].label &&
                    currentFilter === null)
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => router.push(`?filter=${filter.id}`)}
                className={cn(
                  "cursor-pointer",
                  currentFilter === filter.id ||
                    (filter.label === filterOptions[0].label &&
                      currentFilter === null)
                    ? "bg-primary border-0"
                    : "bg-transparent",
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6">
        {filteredPolls.map((poll, index) => (
          <PollPreview key={index} poll={poll as Poll} />
        ))}
      </div>

      {filteredPolls.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-muted-foreground mb-4">
            <TrendingUp className="mx-auto mb-4 h-12 w-12" />
            <p className="text-lg">No polls found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Polls;
