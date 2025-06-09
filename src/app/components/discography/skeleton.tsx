import { ArrowLeft } from "lucide-react";

export default function DiscographySkeleton() {
  return (
    <>
      <div className="text-primary hover:text-ring/50 mb-6 inline-flex items-center text-sm no-underline transition-[color]">
        <ArrowLeft className="mr-2 h-4 w-4" />
        <div className="skeleton h-5 w-32 animate-pulse rounded-lg"></div>
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

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="bg-card block rounded-xl border p-4 no-underline transition-all"
            >
              <div className="relative mb-3 aspect-square w-full rounded-sm">
                <div className="skeleton h-full w-full animate-pulse rounded-sm"></div>
              </div>
              <div className="skeleton h-5 w-32 animate-pulse rounded-lg"></div>
              <div className="mt-1 flex items-center justify-between">
                <div className="skeleton h-5 w-12 animate-pulse rounded-lg"></div>
                <div className="flex items-center">
                  <div className="skeleton ml-1 h-5 w-5 animate-pulse rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
