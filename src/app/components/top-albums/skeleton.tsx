import AlbumSkeleton from "../album/skeleton";
import ItemGrid from "../layout/item-grid";

function TopAlbumsSkeleton() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div className="skeleton h-8 w-30 animate-pulse rounded-lg"></div>
        <div className="skeleton h-9 w-30 animate-pulse rounded-md"></div>
      </div>
      <ItemGrid>
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <AlbumSkeleton key={index} />
          ))}
      </ItemGrid>
    </section>
  );
}

export default TopAlbumsSkeleton;
