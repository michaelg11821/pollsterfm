import { cn } from "@/lib/next-utils";
import { Card } from "../ui/card";

type RandomAffinitiesSkeletonProps = {
  amount?: number;
  compact?: boolean;
};

function RandomAffinitiesSkeleton({
  amount,
  compact,
}: RandomAffinitiesSkeletonProps = {}) {
  const count = amount ?? 12;
  const placeholderItems = Array(count).fill(null);
  const isCompact = compact ?? count <= 6;

  return (
    <div
      className={cn(
        "grid gap-3",
        isCompact
          ? "grid-cols-2 sm:grid-cols-3"
          : "grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
      )}
    >
      {placeholderItems.map((_, i) => (
        <Card
          key={`affinity-skeleton-${i}`}
          className={cn(
            "skeleton animate-pulse items-center justify-center",
            isCompact ? "h-20" : "h-32",
          )}
        />
      ))}
    </div>
  );
}

export default RandomAffinitiesSkeleton;
