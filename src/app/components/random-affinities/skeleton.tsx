import { cn } from "@/lib/next-utils";
import ItemGrid from "../layout/item-grid";
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

  if (isCompact) {
    return (
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3")}>
        {placeholderItems.map((_, i) => (
          <Card
            key={`affinity-skeleton-${i}`}
            className="skeleton h-20 animate-pulse items-center justify-center"
          />
        ))}
      </div>
    );
  }

  return (
    <ItemGrid density="compact" gap="sm">
      {placeholderItems.map((_, i) => (
        <Card
          key={`affinity-skeleton-${i}`}
          className="skeleton h-32 animate-pulse items-center justify-center"
        />
      ))}
    </ItemGrid>
  );
}

export default RandomAffinitiesSkeleton;
