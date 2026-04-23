import { getAffinityColor } from "@/lib/convex-utils";
import { cn } from "@/lib/next-utils";
import type { Affinity } from "@/lib/types/pollster";
import Link from "next/link";

type AffinityCardProps = {
  affinity: Affinity;
  compact?: boolean;
};

function AffinityCard({ affinity, compact }: AffinityCardProps) {
  const gradientClass = getAffinityColor(affinity);

  return (
    <Link href={`/affinities/${encodeURIComponent(affinity)}`}>
      <div
        className={cn(
          "group border-border hover:border-primary/40 relative cursor-pointer overflow-hidden rounded-xl border transition-all duration-200 hover:-translate-y-0.5",
          compact ? "h-20" : "h-32",
        )}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-80 transition-opacity duration-200 group-hover:opacity-100`}
        />

        <div
          className={cn(
            "relative flex h-full items-center justify-center p-3",
            compact ? "p-2" : "p-4",
          )}
        >
          <span
            className={cn(
              "text-center leading-tight font-semibold",
              compact ? "text-sm" : "text-base",
            )}
          >
            {affinity}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default AffinityCard;
