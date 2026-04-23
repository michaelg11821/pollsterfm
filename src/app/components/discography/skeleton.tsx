import AlbumSkeleton from "../album/skeleton";
import ItemGrid from "../layout/item-grid";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/next-utils";
import { ChevronLeft } from "lucide-react";

export default function DiscographySkeleton() {
  return (
    <>
      <div className="mb-6">
        <div
          aria-hidden
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "opacity-60",
          )}
        >
          <ChevronLeft />
        </div>
      </div>

      <div className="mb-8 flex items-center gap-6">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl shadow-md/20 dark:shadow-none">
          <div className="skeleton h-full w-full animate-pulse rounded-xl"></div>
        </div>
        <div>
          <div className="skeleton h-9 w-64 animate-pulse rounded-lg"></div>
          <div className="skeleton mt-2 h-7 w-36 animate-pulse rounded-lg"></div>
        </div>
      </div>

      <ItemGrid density="dense">
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <AlbumSkeleton key={index} />
          ))}
      </ItemGrid>
    </>
  );
}
