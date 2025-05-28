function TrackSkeleton() {
  return (
    <div className="flex items-center gap-4 bg-none p-2">
      <div className="bg-foreground/8 h-10 w-10 animate-pulse rounded-lg"></div>

      <div>
        <div className="bg-foreground/8 mb-1 h-3 w-50 animate-pulse rounded-lg"></div>
        <div className="bg-foreground/8 h-3 w-37 animate-pulse rounded-lg"></div>
      </div>

      <div className="bg-foreground/8 ml-auto h-3 w-21 animate-pulse rounded-lg"></div>
    </div>
  );
}

export default TrackSkeleton;
