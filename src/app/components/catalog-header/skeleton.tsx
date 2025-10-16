import { cn } from "@/lib/next-utils";
import type { CatalogItemType } from "@/lib/types/pollster";

type CatalogHeaderSkeletonProps = {
  itemType: CatalogItemType;
};

function CatalogHeaderSkeleton({ itemType }: CatalogHeaderSkeletonProps) {
  const isArtist = itemType === "artist";

  return (
    <div className="content-wrapper px-5 py-0 xl:p-0">
      <div
        className={cn(
          "flex flex-col gap-6",
          isArtist
            ? "md:flex-row md:items-center"
            : "items-center md:flex-row md:items-start",
        )}
      >
        <div
          className={cn(
            "bg-muted shrink-0 animate-pulse overflow-hidden",
            isArtist
              ? "h-40 w-40 self-center rounded-xl md:h-56 md:w-56 md:self-start"
              : "mx-auto h-48 w-48 rounded-lg md:mx-0 md:h-64 md:w-64",
          )}
        />

        <div
          className={cn(
            isArtist ? "shrink-1 grow-1 basis-0" : "flex-1",
            isArtist ? "text-left" : "text-center md:text-left",
          )}
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div
              className={cn(
                "flex flex-col gap-3",
                isArtist
                  ? "items-center md:items-start"
                  : "items-center md:items-start",
              )}
            >
              <div className="bg-muted h-6 w-16 animate-pulse rounded" />
              <div
                className={cn(
                  "bg-muted animate-pulse rounded",
                  isArtist ? "h-12 w-64" : "h-10 w-56",
                )}
              />
              {!isArtist && (
                <div className="bg-muted h-6 w-32 animate-pulse rounded" />
              )}
              <div className="flex gap-2">
                <div className="bg-muted h-6 w-20 animate-pulse rounded-full" />
                <div className="bg-muted h-6 w-24 animate-pulse rounded-full" />
                <div className="bg-muted h-6 w-16 animate-pulse rounded-full" />
              </div>
              <div className="flex gap-3">
                <div className="bg-muted h-5 w-20 animate-pulse rounded" />
                <div className="bg-muted h-5 w-20 animate-pulse rounded" />
              </div>
            </div>
            <div className="bg-muted h-10 w-32 animate-pulse self-center rounded md:self-end" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CatalogHeaderSkeleton;
