import { Fragment } from "react";

function TopGenresSkeleton() {
  return (
    <div className="mt-2 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 md:justify-start">
      {Array(5)
        .fill(null)
        .map((_, i) => (
          <Fragment key={i}>
            <div className="skeleton h-5 w-16 animate-pulse rounded-lg"></div>
            {i < 4 && (
              <div className="skeleton h-5 w-2 animate-pulse rounded-lg"></div>
            )}
          </Fragment>
        ))}
      <div className="skeleton h-5 w-12 animate-pulse rounded-lg"></div>
    </div>
  );
}

export default TopGenresSkeleton;
