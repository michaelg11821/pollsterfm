import ReactionsSkeleton from "../reactions/skeleton";

function NowPlayingSkeleton() {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center">
      <div className="relative mx-auto my-0 h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:m-0 sm:h-16 sm:w-16">
        <div className="bg-foreground/8 h-full w-full animate-pulse rounded-xl"></div>
      </div>

      <div className="mt-3 flex-1 text-center sm:mt-0 sm:text-left">
        <div className="mb-1 flex flex-wrap justify-center gap-2 sm:justify-start">
          <div className="bg-foreground/8 h-3.5 w-20 animate-pulse rounded-full"></div>
        </div>
        <div className="bg-foreground/8 mx-auto my-0 h-3.5 w-38 animate-pulse rounded-lg sm:m-0"></div>
        <div className="bg-foreground/8 mx-auto mt-1 mb-0 flex h-3.5 w-55 animate-pulse justify-center gap-1 rounded-lg sm:mx-0 sm:justify-start"></div>
      </div>

      <ReactionsSkeleton />
    </div>
  );
}

export default NowPlayingSkeleton;
