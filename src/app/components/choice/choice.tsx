import type { Choice } from "@/lib/types/pollster";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

type ChoiceProps = {
  choice: Choice;
  hasVoted: boolean;
  selectedOption: number | null;
  index: number;
  handleVote: (index: number) => void;
  calculatePercentage: (votes: number) => number;
  pollEnded: boolean;
};

function Choice({
  choice,
  hasVoted,
  selectedOption,
  index,
  handleVote,
  calculatePercentage,
  pollEnded,
}: ChoiceProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
        hasVoted || pollEnded
          ? "bg-card border"
          : selectedOption === index
            ? "border-primary/50 bg-primary/20 ring-ring/30 ring-1"
            : "cursor-pointer border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
      }`}
      onClick={() => !hasVoted && !pollEnded && handleVote(index)}
    >
      <div className="p-4">
        <div className="mb-3 flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/20">
            <Image
              src={choice.image}
              alt=""
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 space-y-1">
              {choice.artist && !choice.album && !choice.track && (
                <Link
                  href={`/catalog/${encodeURIComponent(choice.artist)}`}
                  className="block w-fit font-semibold"
                  onClick={(e) => e.stopPropagation()}
                >
                  {choice.artist}
                  <ExternalLink className="ml-1 inline h-3 w-3 opacity-60" />
                </Link>
              )}

              {choice.artist && choice.album && !choice.track && (
                <>
                  <Link
                    href={`/catalog/${encodeURIComponent(choice.artist)}/discography/${encodeURIComponent(choice.album)}`}
                    className="block w-fit font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {choice.album}
                    <ExternalLink className="ml-1 inline h-3 w-3 opacity-60" />
                  </Link>
                  <Link
                    href={`/catalog/${encodeURIComponent(choice.artist)}`}
                    className="text-muted-foreground block w-fit text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    by {choice.artist}
                    <ExternalLink className="ml-1 inline h-3 w-3 opacity-60" />
                  </Link>
                </>
              )}

              {choice.artist && choice.album && choice.track && (
                <>
                  <Link
                    href={`/catalog/${encodeURIComponent(choice.artist)}/discography/${encodeURIComponent(choice.album!)}/${encodeURIComponent(choice.track)}`}
                    className="block w-fit font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {choice.track}
                    <ExternalLink className="ml-1 inline h-3 w-3 opacity-60" />
                  </Link>
                  <Link
                    href={`/catalog/${encodeURIComponent(choice.artist)}/discography/${encodeURIComponent(choice.album)}`}
                    className="text-muted-foreground block w-fit text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {choice.album}
                    <ExternalLink className="ml-1 inline h-3 w-3 opacity-60" />
                  </Link>
                  <Link
                    href={`/catalog/${encodeURIComponent(choice.artist)}`}
                    className="text-muted-foreground block w-fit text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    by {choice.artist}
                    <ExternalLink className="ml-1 inline h-3 w-3 opacity-60" />
                  </Link>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {choice.affinities.map((affinity, index) => (
                <Badge key={index} variant="secondary">
                  {affinity}
                </Badge>
              ))}
            </div>
          </div>
          {hasVoted ||
            (pollEnded && (
              <div className="shrink-0 text-right">
                <span className="text-2xl font-bold">
                  {calculatePercentage(choice.totalVotes)}%
                </span>
                <p className="text-muted-foreground text-xs">
                  {choice.totalVotes.toLocaleString()} vote
                  {(choice.totalVotes <= 0 || choice.totalVotes > 1) && "s"}
                </p>
              </div>
            ))}
        </div>

        {hasVoted ||
          (pollEnded && (
            <Progress
              value={calculatePercentage(choice.totalVotes)}
              className="h-2"
            />
          ))}
      </div>
    </div>
  );
}

export default Choice;
