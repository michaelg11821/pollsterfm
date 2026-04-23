function HeroPollSkeleton() {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div className="skeleton h-4 w-32 animate-pulse rounded-lg"></div>
        <div className="skeleton h-4 w-16 animate-pulse rounded-lg"></div>
      </div>
      <div className="relative w-full overflow-hidden">
        <div className="bg-card border-border relative w-full overflow-hidden rounded-xl border shadow-xl">
          <div className="border-border flex items-center gap-3 border-b px-4 py-4 sm:px-5">
            <div className="bg-background relative m-0 flex h-10 w-10 items-center justify-center gap-1.5 rounded-full border-none">
              <div className="skeleton h-full w-full animate-pulse rounded-full"></div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="skeleton h-5 w-48 animate-pulse rounded-lg"></div>
              <div className="skeleton mt-1 h-3 w-32 animate-pulse rounded-lg"></div>
            </div>
            <div className="skeleton h-6 w-12 animate-pulse rounded-full"></div>
          </div>

          <div className="space-y-3 p-4 sm:p-5">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="relative min-w-0">
                  <div className="border-border relative overflow-hidden rounded-lg border p-3">
                    <div className="relative flex min-w-0 items-center gap-2 sm:gap-3">
                      <div className="skeleton h-10 w-10 shrink-0 animate-pulse rounded-md"></div>
                      <div className="skeleton h-4 flex-1 animate-pulse rounded-lg"></div>
                      <div className="skeleton h-3 w-8 animate-pulse rounded-lg"></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="border-border bg-muted/30 flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="skeleton h-3 w-20 animate-pulse rounded-lg"></div>
              <div className="skeleton h-3 w-20 animate-pulse rounded-lg"></div>
            </div>
            <div className="skeleton h-3 w-16 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroPollSkeleton;
