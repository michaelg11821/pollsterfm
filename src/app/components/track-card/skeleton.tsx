function TrackCardSkeleton() {
  return (
    <div className="bg-card block rounded-xl border p-4 no-underline">
      <div className="relative mb-3 aspect-square w-full rounded-sm">
        <div className="skeleton h-full w-full animate-pulse rounded-sm"></div>
      </div>
      <div className="skeleton h-5 w-30 animate-pulse rounded-lg"></div>
      <div className="skeleton mt-1 h-4 w-40 animate-pulse rounded-lg"></div>
    </div>
  );
}

export default TrackCardSkeleton;
