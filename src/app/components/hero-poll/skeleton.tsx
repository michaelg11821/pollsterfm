function HeroPollSkeleton() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="from-primary/20 via-primary/5 pointer-events-none absolute -top-8 right-0 h-64 w-64 rounded-full bg-gradient-to-br to-transparent opacity-50 blur-3xl" />

      <div className="bg-card border-border relative w-full overflow-hidden rounded-xl border shadow-xl">
        <div className="border-border flex items-center gap-3 border-b px-4 py-4 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="bg-accent h-9 w-9 animate-pulse rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="bg-accent h-5 w-full max-w-[10rem] animate-pulse rounded" />
              <div className="bg-accent h-3 w-full max-w-[7rem] animate-pulse rounded" />
            </div>
          </div>
          <div className="bg-accent h-5 w-10 shrink-0 animate-pulse rounded-full" />
        </div>

        <div className="space-y-3 p-4 sm:p-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border-border min-w-0 rounded-lg border p-3"
            >
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <div className="bg-accent h-10 w-10 shrink-0 animate-pulse rounded-md" />
                <div className="bg-accent h-4 min-w-0 flex-1 animate-pulse rounded" />
                <div className="bg-accent h-3 w-8 shrink-0 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="border-border flex flex-wrap items-center gap-2 border-t px-4 py-3 sm:px-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-accent h-5 w-16 animate-pulse rounded-full"
            />
          ))}
        </div>

        <div className="border-border bg-muted/30 flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="bg-accent h-3 w-20 animate-pulse rounded" />
            <div className="bg-accent h-3 w-16 animate-pulse rounded" />
          </div>
          <div className="bg-accent h-3 w-16 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

export default HeroPollSkeleton;
