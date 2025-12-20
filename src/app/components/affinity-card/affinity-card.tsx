import { cn } from "@/lib/next-utils";
import type { Affinity } from "@/lib/types/pollster";
import Link from "next/link";

type AffinityCardProps = {
  affinity: Affinity;
  compact?: boolean;
};

function getAffinityColor(affinity: string): string {
  let hash = 0;
  for (let i = 0; i < affinity.length; i++) {
    hash = affinity.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    "from-primary/25 to-primary/10",
    "from-chart-2/25 to-chart-2/10",
    "from-chart-4/25 to-chart-4/10",
    "from-chart-5/25 to-chart-5/10",
    "from-chart-1/25 to-chart-1/10",
    "from-chart-3/25 to-chart-3/10",
  ];

  return colors[Math.abs(hash) % colors.length];
}

function AffinityCard({ affinity, compact }: AffinityCardProps) {
  const gradientClass = getAffinityColor(affinity);

  return (
    <Link href={`/affinities?q=${encodeURIComponent(affinity)}`}>
      <div
        className={cn(
          "group border-border hover:border-primary/40 relative cursor-pointer overflow-hidden rounded-lg border transition-all duration-200 hover:-translate-y-0.5",
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
