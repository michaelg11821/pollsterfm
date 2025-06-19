import TopGenresSkeleton from "../top-genres/skeleton";

function ArtistHeaderSkeleton() {
  return (
    <div className="content-wrapper px-5 py-0 xl:p-0">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="h-40 w-40 shrink-0 self-center overflow-hidden rounded-xl md:h-56 md:w-56 md:self-start">
          <div className="skeleton h-full w-full animate-pulse"></div>
        </div>
        <div className="shrink-1 grow-1 basis-0">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="flex flex-col items-center md:block">
              <div className="mb-2 flex items-center gap-2">
                <div className="skeleton h-5 w-12.5 animate-pulse rounded-md"></div>
              </div>
              <div className="skeleton h-7.5 w-50 animate-pulse rounded-lg md:h-10"></div>
              <TopGenresSkeleton />
            </div>
            <div className="skeleton h-9 w-25 animate-pulse self-center rounded-md md:self-end"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistHeaderSkeleton;
