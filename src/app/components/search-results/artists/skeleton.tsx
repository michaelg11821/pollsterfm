import { Card } from "../../ui/card";

function ArtistResultsSkeleton() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Artists</h2>
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
              <Card
                key={i}
                className="flex max-w-80 min-w-50 items-center gap-3 p-4"
              >
                <div className="skeleton relative h-20 w-20 animate-pulse overflow-hidden rounded-full"></div>
                <div className="skeleton h-5 w-40 animate-pulse rounded-lg"></div>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
}

export default ArtistResultsSkeleton;
