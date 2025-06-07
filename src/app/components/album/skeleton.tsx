import { Star } from "lucide-react";

function AlbumSkeleton() {
  return (
    <div className="bg-card hover:bg-accent block rounded-xl border p-4 no-underline transition-all hover:transform-[scale(1.02)]">
      <div className="relative mb-3 aspect-square w-full rounded-sm">
        <div className="skeleton h-full w-full animate-pulse rounded-sm"></div>
      </div>
      <div className="skeleton h-5 w-25 animate-pulse rounded-lg"></div>
      <div className="mt-1 flex items-center justify-between">
        <div className="skeleton h-5 w-12.5 animate-pulse rounded-lg"></div>
        <div className="flex items-center">
          <Star className="text-primary h-3.5 w-3.5 shrink-0" />
          <div className="skeleton ml-1 h-5 w-5 animate-pulse rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export default AlbumSkeleton;
