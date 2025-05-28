function ReactionsSkeleton() {
  return (
    <div className="sm:flex-end mt-4 flex flex-col items-center gap-1 sm:mt-0">
      <div className="bg-foreground/8 mb-1 h-3 w-25 animate-pulse rounded-lg"></div>
      <div className="flex items-center gap-2.5 sm:gap-2">
        <div className="bg-foreground/8 h-9 w-9 animate-pulse rounded-full"></div>
        <div className="bg-foreground/8 h-9 w-9 animate-pulse rounded-full"></div>
        <div className="bg-foreground/8 h-9 w-9 animate-pulse rounded-full"></div>
      </div>
    </div>
  );
}

export default ReactionsSkeleton;
