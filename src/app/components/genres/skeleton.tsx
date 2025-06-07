import { Card, CardContent } from "../ui/card";

function GenresSkeleton() {
  return (
    <>
      <div className="skeleton mb-6 h-5 w-25 animate-pulse rounded-lg text-sm"></div>
      <div className="mb-8 flex items-center gap-6">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
          <div className="skeleton h-full w-full animate-pulse"></div>
        </div>
        <div>
          <div className="skeleton h-7.5 w-50 animate-pulse rounded-lg"></div>
          <div className="skeleton mt-1 h-6 w-25 animate-pulse rounded-lg"></div>
        </div>
      </div>
      <div className="grid gap-6">
        <Card className="py-4">
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-accent flex items-center justify-between rounded-sm p-3 transition-[background-color]"
                  >
                    <div className="skeleton h-5 w-25 animate-pulse rounded-lg"></div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default GenresSkeleton;
