import { Card } from "../ui/card";

type RandomAffinitiesSkeletonProps = {
  amount?: number;
};

function RandomAffinitiesSkeleton({
  amount,
}: RandomAffinitiesSkeletonProps = {}) {
  const placeholderItems = Array(amount ?? 12).fill(null);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {placeholderItems.map((_, i) => (
        <Card
          key={`affinity-skeleton-${i}`}
          className="skeleton h-32 animate-pulse items-center justify-center"
        ></Card>
      ))}
    </div>
  );
}

export default RandomAffinitiesSkeleton;
