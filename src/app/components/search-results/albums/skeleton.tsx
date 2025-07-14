import AlbumSkeleton from "../../album/skeleton";

function AlbumResultsSkeleton() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Albums</h2>
        <div className="flex items-center gap-2">
          <div className="skeleton h-10 w-10 animate-pulse rounded-full"></div>
          <div className="skeleton h-10 w-10 animate-pulse rounded-full"></div>
        </div>
      </div>

      <div className="scroll-gradient relative">
        <div className="flex gap-6 overflow-x-hidden py-2">
          {Array(25)
            .fill(null)
            .map((_, i) => (
              <div key={`album-skeleton-${i}`} className="max-w-50 min-w-50">
                <AlbumSkeleton />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default AlbumResultsSkeleton;
