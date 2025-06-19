function SimilarArtistsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array(4)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            className="hover:bg-foreground/10 -mr-2 -ml-2 flex items-center gap-3 rounded-xl p-2 no-underline transition-[background-color]"
          >
            <div className="bg-background/20 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border">
              <div className="skeleton h-6 w-6 animate-pulse rounded-full"></div>
            </div>
            <div>
              <div className="skeleton h-5 w-32 animate-pulse rounded-lg"></div>
              <div className="skeleton mt-1 h-6 w-20 animate-pulse rounded-full"></div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default SimilarArtistsSkeleton;
