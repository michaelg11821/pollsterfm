import { Card, CardContent, CardHeader } from "../ui/card";

function PollSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Main Content */}
      <div className="space-y-8 lg:col-span-2">
        {/* Header Skeleton */}
        <header>
          <div className="mb-4 flex items-center gap-2">
            <div className="skeleton h-6 w-16 animate-pulse rounded-full" />
            <div className="skeleton h-6 w-14 animate-pulse rounded-full" />
            <div className="skeleton h-5 w-24 animate-pulse rounded" />
          </div>

          <div className="skeleton mb-3 h-10 w-full max-w-lg animate-pulse rounded-lg lg:h-11" />
          <div className="skeleton mb-6 h-6 w-3/4 max-w-md animate-pulse rounded" />

          <div className="flex items-center gap-3">
            <div className="skeleton h-10 w-10 animate-pulse rounded-full" />
            <div>
              <div className="skeleton h-4 w-24 animate-pulse rounded" />
              <div className="skeleton mt-1.5 h-3 w-20 animate-pulse rounded" />
            </div>
          </div>
        </header>

        {/* Voting Card Skeleton */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="skeleton h-6 w-32 animate-pulse rounded" />
              <div className="skeleton h-6 w-20 animate-pulse rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="border-border/60 overflow-hidden rounded-xl border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="skeleton h-16 w-16 shrink-0 animate-pulse rounded-lg md:h-18 md:w-18" />
                    <div className="min-w-0 flex-1">
                      <div className="skeleton mb-2 h-5 w-40 animate-pulse rounded" />
                      <div className="skeleton mb-2 h-4 w-28 animate-pulse rounded" />
                      <div className="flex gap-1">
                        <div className="skeleton h-5 w-14 animate-pulse rounded-full" />
                        <div className="skeleton h-5 w-16 animate-pulse rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            <div className="skeleton mt-4 h-11 w-full animate-pulse rounded-lg" />
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Skeleton */}
      <aside className="space-y-6">
        {/* Stats Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="skeleton h-5 w-24 animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="skeleton mb-1 h-3 w-16 animate-pulse rounded" />
                <div className="skeleton h-8 w-14 animate-pulse rounded" />
              </div>
              <div>
                <div className="skeleton mb-1 h-3 w-14 animate-pulse rounded" />
                <div className="skeleton h-8 w-16 animate-pulse rounded" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="skeleton h-2 w-2 animate-pulse rounded-full" />
                <div className="skeleton h-5 w-24 animate-pulse rounded" />
              </div>
              <div className="skeleton h-5 w-16 animate-pulse rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="skeleton mx-auto mb-1 h-6 w-8 animate-pulse rounded" />
                <div className="skeleton mx-auto h-3 w-14 animate-pulse rounded" />
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="skeleton mx-auto mb-1 h-6 w-12 animate-pulse rounded" />
                <div className="skeleton mx-auto h-3 w-14 animate-pulse rounded" />
              </div>
            </div>

            <div className="skeleton h-px w-full animate-pulse" />

            <div>
              <div className="skeleton mb-3 h-3 w-24 animate-pulse rounded" />
              <div className="space-y-2.5">
                {Array(3)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="skeleton h-7 w-7 animate-pulse rounded-full" />
                      <div className="min-w-0 flex-1">
                        <div className="skeleton mb-1 h-4 w-20 animate-pulse rounded" />
                        <div className="skeleton h-3 w-28 animate-pulse rounded" />
                      </div>
                      <div className="skeleton h-3 w-12 animate-pulse rounded" />
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

export default PollSkeleton;
