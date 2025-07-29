"use client";

import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";

import { Badge } from "@/app/components/ui/badge";
import { Card } from "@/app/components/ui/card";
import { capitalize, getDateFromCreatedAt } from "@/lib/utils";
import { Calendar, ChevronRight, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import PollsSkeleton from "./skeleton";

function Polls() {
  const polls = useQuery(api.pollster.poll.getPolls);

  if (polls === undefined) return <PollsSkeleton />;

  return (
    <div>
      {/* <div className="mb-8">
            <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {filterOptions.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={selectedFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange(filter.id)}
                    className={
                      selectedFilter === filter.id
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0"
                        : "border-white/20 text-white/70 hover:bg-white/10 hover:text-white bg-transparent"
                    }
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </Card>
          </div> */}

      {/* Polls Grid */}
      <div className="grid gap-6">
        {/* component called PollPreview */}
        {polls.map((poll, index) => (
          <Link key={index} href={`/polls/${poll._id}`}>
            <Card className="group cursor-pointer border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-200 hover:bg-white/10">
              {/* Poll Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-white transition-colors group-hover:text-rose-300">
                      {poll.question}
                    </h2>
                    <Badge
                      variant="outline"
                      className="border-rose-500/50 bg-rose-500/10 text-rose-400"
                    >
                      {capitalize(poll.pollType)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>@{poll.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{getDateFromCreatedAt(poll._creationTime)}</span>
                    </div>
                    {/* <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{poll.totalVotes.toLocaleString()} votes</span>
                        </div> */}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-white/40 transition-colors group-hover:text-rose-400" />
              </div>

              {/* Poll Preview Info */}
              {/* <div className="mb-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-white/60 mb-1">{poll.optionCount} options available</div>
                          <div className="text-white font-medium">Currently leading: {poll.topOption}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-rose-400">{poll.totalVotes.toLocaleString()}</div>
                          <div className="text-sm text-white/60">total votes</div>
                        </div>
                      </div>
                    </div>
                  </div> */}

              {/* Affinities */}
              <div className="flex items-center gap-2">
                <span className="self-start text-sm text-white/60">
                  Affinities:
                </span>
                <div className="flex flex-wrap gap-2">
                  {poll.choices.map((choice) =>
                    choice.affinities.map((affinity) => (
                      <Badge
                        key={affinity}
                        variant="outline"
                        className="border-white/20 bg-white/5 text-xs text-white/70"
                      >
                        {affinity}
                      </Badge>
                    )),
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {polls.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-white/60">
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
