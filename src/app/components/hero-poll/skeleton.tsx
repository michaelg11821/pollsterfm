function HeroPollSkeleton() {
  return (
    <div className="relative">
      <div className="from-primary/20 via-primary/5 absolute -top-8 -right-8 h-64 w-64 rounded-full bg-gradient-to-br to-transparent blur-3xl" />

      <div className="bg-card border-border relative overflow-hidden rounded-xl border shadow-xl">
        <div className="border-border flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent h-9 w-9 animate-pulse rounded-lg" />
            <div className="space-y-2">
              <div className="bg-accent h-5 w-40 animate-pulse rounded" />
              <div className="bg-accent h-3 w-28 animate-pulse rounded" />
            </div>
          </div>
          <div className="bg-accent h-5 w-10 animate-pulse rounded-full" />
        </div>

        <div className="space-y-3 p-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-border rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="bg-accent h-10 w-10 shrink-0 animate-pulse rounded-md" />
                <div className="bg-accent h-4 flex-1 animate-pulse rounded" />
                <div className="bg-accent h-3 w-8 shrink-0 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="border-border flex items-center gap-2 border-t px-5 py-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-accent h-5 w-16 animate-pulse rounded-full"
            />
          ))}
        </div>

        <div className="border-border bg-muted/30 flex items-center justify-between border-t px-5 py-3">
          <div className="flex items-center gap-4">
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
