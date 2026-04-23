import AlbumSkeleton from "@/app/components/album/skeleton";
import ArtistCardSkeleton from "@/app/components/artist-card/skeleton";
import ItemGrid from "@/app/components/layout/item-grid";
import TrackCardSkeleton from "@/app/components/track-card/skeleton";

type SectionSkeletonProps = {
  title: string;
  children: React.ReactNode;
};

function SectionSkeleton({ title, children }: SectionSkeletonProps) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="skeleton h-5 w-8 animate-pulse rounded-lg" />
      </div>
      <ItemGrid>{children}</ItemGrid>
    </section>
  );
}

function AffinityItemsSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <SectionSkeleton title="Tracks">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <TrackCardSkeleton key={i} />
          ))}
      </SectionSkeleton>
      <SectionSkeleton title="Albums">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <AlbumSkeleton key={i} />
          ))}
      </SectionSkeleton>
      <SectionSkeleton title="Artists">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <ArtistCardSkeleton key={i} />
          ))}
      </SectionSkeleton>
    </div>
  );
}

export default AffinityItemsSkeleton;
