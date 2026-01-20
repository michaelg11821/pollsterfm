import type { Choice } from "@/lib/types/pollster";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";

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
  const isSelected = selectedOption === index;
  const showResults = hasVoted || pollEnded;
  const percentage = calculatePercentage(choice.totalVotes);
  const isInteractive = !hasVoted && !pollEnded;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border transition-all duration-200 ${
        showResults
          ? "bg-card"
          : isSelected
            ? "border-primary bg-primary/5 ring-primary/20 ring-2"
            : "hover:border-border hover:bg-muted/30 border-border/60 cursor-pointer"
      }`}
      onClick={() => isInteractive && handleVote(index)}
    >
      {showResults && (
        <div
          className="bg-primary/10 absolute inset-y-0 left-0 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      )}

      <div className="relative p-4">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg md:h-18 md:w-18">
            <Image
              src={choice.image}
              alt=""
              width={72}
              height={72}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1.5 space-y-0.5">
              {choice.artist && !choice.album && !choice.track && (
                <Link
                  href={`/catalog/${encodeURIComponent(choice.artist)}`}
                  className="hover:text-primary group/link inline-flex items-center gap-1 font-semibold transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {choice.artist}
                  <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-50" />
                </Link>
              )}

              {choice.artist && choice.album && !choice.track && (
                <>
                  <Link
                    href={`/catalog/${encodeURIComponent(choice.artist)}/discography/${encodeURIComponent(choice.album)}`}
                    className="hover:text-primary group/link inline-flex items-center gap-1 font-semibold transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {choice.album}
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-50" />
                  </Link>
                  <Link
                    href={`/catalog/${encodeURIComponent(choice.artist)}`}
                    className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {choice.artist}
                  </Link>
                </>
              )}

              {choice.artist && choice.album && choice.track && (
                <>
                  <Link
                    href={`/catalog/${encodeURIComponent(choice.artist)}/discography/${encodeURIComponent(choice.album!)}/${encodeURIComponent(choice.track)}`}
                    className="hover:text-primary group/link inline-flex items-center gap-1 font-semibold transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {choice.track}
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-50" />
                  </Link>
                  <p className="text-muted-foreground text-sm">
                    <Link
                      href={`/catalog/${encodeURIComponent(choice.artist)}/discography/${encodeURIComponent(choice.album)}`}
                      className="hover:text-foreground transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {choice.album}
                    </Link>
                    <span className="mx-1.5">·</span>
                    <Link
                      href={`/catalog/${encodeURIComponent(choice.artist)}`}
                      className="hover:text-foreground transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {choice.artist}
                    </Link>
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {choice.affinities.slice(0, 3).map((affinity, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {affinity}
                </Badge>
              ))}
              {choice.affinities.length > 3 && (
                <Badge variant="outline" className="text-xs font-normal">
                  +{choice.affinities.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {showResults && (
            <div className="shrink-0 text-right">
              <span className="text-2xl font-bold tabular-nums md:text-3xl">
                {percentage}%
              </span>
              <p className="text-muted-foreground text-xs tabular-nums">
                {choice.totalVotes.toLocaleString()} vote
                {choice.totalVotes !== 1 && "s"}
              </p>
            </div>
          )}
        </div>

        {showResults && (
          <div className="bg-border/50 mt-3 h-1 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Choice;
