import { Card, CardContent, CardHeader } from "../ui/card";

function PopularPollsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array(4)
        .fill(null)
        .map((_, i) => (
          <Card key={i} className="h-full">
            <CardHeader className="relative pb-3">
              <div className="skeleton mb-3 h-6 w-full animate-pulse rounded-lg"></div>
              <div className="flex flex-wrap gap-2">
                <div className="skeleton h-5 w-16 animate-pulse rounded-md"></div>
                <div className="skeleton h-5 w-16 animate-pulse rounded-md"></div>
                <div className="skeleton h-5 w-12 animate-pulse rounded-md"></div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4 text-sm">
                <div className="skeleton h-4 w-24 animate-pulse rounded-lg"></div>
              </div>
              <div className="skeleton mt-4 h-1.5 w-full animate-pulse rounded-full"></div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

export default PopularPollsSkeleton;
