"use client";

import { Badge } from "@/app/components/ui/badge";
import { Card } from "@/app/components/ui/card";
import type { Affinity, Poll } from "@/lib/types/pollster";
import { getChoiceItemName, getTopChoice } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Calendar, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

type PollPreviewProps = {
  poll: Poll;
};

function PollPreview({ poll }: PollPreviewProps) {
  const uniqueAffinities = useMemo(() => {
    return Array.from(
      new Set(
        poll.choices.flatMap((choice) => choice.affinities as Affinity[]),
      ),
    );
  }, [poll]);

  return (
    <Link href={`/polls/${poll._id}`}>
      <Card className="hover:bg-accent cursor-pointer p-6 transition-[background-color]">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h2 className="text-xl font-semibold">{poll.question}</h2>
              <Badge variant="default">{poll.pollType}</Badge>
            </div>
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>@{poll.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(poll._creationTime, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="text-muted-foreground h-5 w-5 transition-colors" />
        </div>

        <div className="mb-4">
          <div className="bg-accent/50 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-muted-foreground mb-1 text-sm">
                  {poll.choices.length} choices available
                </div>
                <div className="font-medium">
                  Currently leading:{" "}
                  {getChoiceItemName(getTopChoice(poll.choices))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {poll.totalVotes.toLocaleString()}
                </div>
                <div className="text-muted-foreground text-sm">
                  vote{poll.totalVotes <= 0 || poll.totalVotes > 1 ? "s " : " "}
                  total
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground self-start text-sm">
            Affinities:
          </span>
          <div className="flex flex-wrap gap-2">
            {uniqueAffinities.map((affinity) => (
              <Badge key={affinity} variant="secondary">
                {affinity}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default PollPreview;
