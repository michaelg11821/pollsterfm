function AlbumTracksSkeleton() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Tracks</h2>
      <div className="space-y-2">
        {Array(8)
          .fill(null)
          .map((_, i) => (
            <div
              key={i}
              className="bg-foreground/5 flex items-center gap-3 rounded-xl px-2 py-3"
            >
              <div className="w-8 text-center">
                <div className="skeleton mx-auto h-4 w-4 animate-pulse rounded-lg"></div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="skeleton h-4 w-48 animate-pulse rounded-lg"></div>
              </div>
              <div className="skeleton h-3 w-10 animate-pulse rounded-lg"></div>
            </div>
          ))}
      </div>
    </section>
  );
}

export default AlbumTracksSkeleton;
