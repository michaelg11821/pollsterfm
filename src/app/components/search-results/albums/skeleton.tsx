import AlbumSkeleton from "../../album/skeleton";

function AlbumResultsSkeleton() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          <div className="skeleton h-7 w-35 animate-pulse rounded-lg"></div>
        </h2>
        <div className="flex items-center gap-2">
          <div className="skeleton h-10 w-10 animate-pulse rounded-full"></div>
          <div className="skeleton h-10 w-10 animate-pulse rounded-full"></div>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-hidden pb-2">
        {Array(25)
          .fill(null)
          .map((_, i) => (
            <AlbumSkeleton key={`album-skeleton-${i}`} />
          ))}
      </div>
    </section>
  );
}

export default AlbumResultsSkeleton;
