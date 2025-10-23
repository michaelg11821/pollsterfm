import { Card, CardContent, CardHeader } from "../ui/card";

function PopularPollsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Array(3)
        .fill(null)
        .map((_, i) => (
          <Card key={i} className="max-h-112.5">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2.5">
                <div className="skeleton h-6 flex-1 animate-pulse rounded-lg sm:h-7"></div>
              </div>
              <div className="my-1 flex flex-wrap gap-2">
                <div className="skeleton h-5 w-16 animate-pulse rounded-full sm:w-20"></div>
                <div className="skeleton h-5 w-20 animate-pulse rounded-full sm:w-24"></div>
              </div>
            </CardHeader>
            <CardContent className="-mt-5">
              <div className="flex items-center text-sm">
                <div className="skeleton h-5 w-20 animate-pulse rounded-lg sm:w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

export default PopularPollsSkeleton;
