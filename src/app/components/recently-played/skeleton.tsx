import TrackSkeleton from "../track/skeleton";

import type { ReactElement } from "react";

type RecentlyPlayedSkeletonProps = {
  limit: number;
};

function RecentlyPlayedSkeleton({ limit }: RecentlyPlayedSkeletonProps) {
  let trackSkeletonKey = 0;

  const skeletons: ReactElement[] = Array(limit).fill(
    <TrackSkeleton key={trackSkeletonKey++} />,
  );

  return <div className="flex flex-col gap-3">{skeletons}</div>;
}

export default RecentlyPlayedSkeleton;
