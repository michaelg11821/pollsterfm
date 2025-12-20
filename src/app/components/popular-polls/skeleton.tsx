import { Card, CardContent, CardHeader } from "../ui/card";

function PopularPollsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array(4)
        .fill(null)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="mb-3 flex items-center gap-2.5">
                <div className="skeleton h-6 flex-1 animate-pulse rounded-lg"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="skeleton h-5 w-16 animate-pulse rounded-full"></div>
                <div className="skeleton h-5 w-20 animate-pulse rounded-full"></div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-sm">
                <div className="skeleton h-5 w-20 animate-pulse rounded-lg"></div>
              </div>
              <div className="skeleton mt-4 h-1.5 animate-pulse rounded-full"></div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

export default PopularPollsSkeleton;
