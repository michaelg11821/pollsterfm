import AlbumSkeleton from "../album/skeleton";

function TopAlbumsSkeleton() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="skeleton h-8 w-30 animate-pulse rounded-lg"></div>
        <div className="h-9 w-30 animate-pulse rounded-md border bg-none"></div>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <AlbumSkeleton key={index} />
          ))}
      </div>
    </div>
  );
}

export default TopAlbumsSkeleton;
