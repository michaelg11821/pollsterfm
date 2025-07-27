function PollsSkeleton() {
  return (
    <div>
      <div className="grid gap-6">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <div
              key={i}
              className="group cursor-pointer border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-200 hover:bg-white/10"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="skeleton h-7 w-64 animate-pulse rounded-lg"></div>
                    <div className="skeleton h-6 w-20 animate-pulse rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="skeleton h-5 w-24 animate-pulse rounded-lg"></div>
                    <div className="skeleton h-5 w-24 animate-pulse rounded-lg"></div>
                  </div>
                </div>
                <div className="skeleton h-5 w-5 animate-pulse rounded-full"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="skeleton h-5 w-24 animate-pulse rounded-lg"></div>
                <div className="flex gap-2">
                  <div className="skeleton h-5 w-16 animate-pulse rounded-full"></div>
                  <div className="skeleton h-5 w-16 animate-pulse rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PollsSkeleton;
