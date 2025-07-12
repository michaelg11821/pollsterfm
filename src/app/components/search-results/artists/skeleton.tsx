import { Card } from "../../ui/card";

function ArtistResultsSkeleton() {
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
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <Card
              key={i}
              className="flex max-w-80 min-w-50 items-center gap-3 p-4"
            >
              <div className="skeleton relative h-20 w-20 animate-pulse overflow-hidden rounded-full"></div>
              <div className="skeleton h-5 w-40 animate-pulse rounded-lg"></div>
            </Card>
          ))}
      </div>
    </section>
  );
}

export default ArtistResultsSkeleton;
