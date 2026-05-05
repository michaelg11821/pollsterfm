type UserActivitySkeletonProps = {
  limit: number;
};

function UserActivitySkeleton({ limit }: UserActivitySkeletonProps) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: limit }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="skeleton size-12 flex-shrink-0 animate-pulse rounded-md" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="skeleton h-4 w-40 animate-pulse rounded" />
            <div className="skeleton h-3 w-56 animate-pulse rounded" />
          </div>
          <div className="skeleton h-3 w-16 flex-shrink-0 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}

export default UserActivitySkeleton;
