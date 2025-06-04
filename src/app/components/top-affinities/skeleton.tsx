import { buttonVariants } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";

function TopAffinitiesSkeleton() {
  const placeholderItems: null[] = Array(6).fill(null);

  return (
    <Card>
      <CardHeader className="mb-0 flex items-center justify-between">
        <h2 className="text-xl font-bold">Affinities</h2>
        <div className={buttonVariants({ variant: "ghost" })}>View All</div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {placeholderItems.map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="mb-1 flex items-center justify-between">
                <div className="skeleton h-3.5 w-25 animate-pulse rounded-lg"></div>
                <div className="skeleton h-4 w-10 animate-pulse rounded-lg"></div>
              </div>
              <div className="skeleton h-2 w-full animate-pulse rounded-full"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TopAffinitiesSkeleton;
