import TrackSkeleton from "../../track/skeleton";

function TrackResultsSkeleton() {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Tracks</h2>
      </div>

      <div className="space-y-2">
        {Array(50)
          .fill(null)
          .map((_, i) => (
            <TrackSkeleton key={`track-skeleton-${i}`} />
          ))}
      </div>
    </section>
  );
}

export default TrackResultsSkeleton;
