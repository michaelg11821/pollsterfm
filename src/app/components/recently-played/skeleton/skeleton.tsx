import TrackSkeleton from "../../track/skeleton/skeleton";

import type { ReactElement } from "react";

import styles from "./skeleton.module.css";

type RecentlyPlayedSkeletonProps = {
  limit: number;
};

function RecentlyPlayedSkeleton({ limit }: RecentlyPlayedSkeletonProps) {
  let trackSkeletonKey = 0;

  const skeletons: ReactElement[] = Array(limit).fill(
    <TrackSkeleton key={trackSkeletonKey++} />
  );

  return <div className={styles.skeletonWrapper}>{skeletons}</div>;
}

export default RecentlyPlayedSkeleton;
