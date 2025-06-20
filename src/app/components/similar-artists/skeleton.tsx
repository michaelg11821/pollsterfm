import { Card, CardContent, CardHeader } from "../ui/card";

function SimilarArtistsSkeleton() {
  return (
    <Card>
      <CardHeader className="mb-0 flex items-center justify-between">
        <div className="skeleton h-7 w-40 animate-pulse rounded-lg"></div>
        <div className="skeleton h-7 w-20 animate-pulse rounded-lg"></div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="hover:bg-foreground/10 -mr-2 -ml-2 flex items-center gap-3 rounded-xl p-2 no-underline transition-[background-color]"
              >
                <div className="bg-background/20 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border"></div>
                <div>
                  <div className="skeleton h-5 w-32 animate-pulse rounded-lg"></div>
                  <div className="skeleton mt-1 h-5 w-20 animate-pulse rounded-lg"></div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default SimilarArtistsSkeleton;
