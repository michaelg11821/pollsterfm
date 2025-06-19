import TopGenresSkeleton from "../top-genres/skeleton";

function AlbumHeaderSkeleton() {
  return (
    <div className="content-wrapper px-5 py-0 xl:p-0">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="mx-auto h-48 w-48 shrink-0 overflow-hidden rounded-lg shadow-xl md:mx-0 md:h-64 md:w-64">
          <div className="skeleton h-full w-full animate-pulse rounded-lg"></div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
                <div className="skeleton h-6 w-16 animate-pulse rounded-full"></div>
              </div>
              <div className="skeleton h-10 w-72 animate-pulse rounded-lg md:h-11 md:w-96"></div>
              <div className="mt-1">
                <div className="skeleton h-7 w-48 animate-pulse rounded-lg"></div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-3 md:justify-start">
                {/* <div className="flex items-center">
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-white/20 animate-pulse"
                      />
                    ))}
                  <div className="skeleton ml-2 h-5 w-10 animate-pulse rounded-lg"></div>
                  <div className="skeleton ml-1 h-5 w-20 animate-pulse rounded-lg"></div>
                </div> */}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="skeleton h-6 w-24 animate-pulse rounded-lg"></div>
                <div className="skeleton h-6 w-24 animate-pulse rounded-lg"></div>
              </div>

              <TopGenresSkeleton />
            </div>
            <div className="skeleton h-10 w-32 animate-pulse self-center rounded-lg md:self-end"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlbumHeaderSkeleton;
