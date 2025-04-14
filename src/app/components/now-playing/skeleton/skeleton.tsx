import styles from "./skeleton.module.css";

export default function NowPlayingSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.nowPlayingImageContainer}>
        <div className={styles.imageSkeleton}></div>
      </div>

      <div className={styles.nowPlayingTrackInfo}>
        <div className={styles.nowPlayingBadgeWrapper}>
          <div className={styles.badgeSkeleton}></div>
        </div>
        <div className={styles.titleSkeleton}></div>
        <div className={styles.detailsSkeleton}></div>
      </div>

      <div className={styles.reactionsContainer}>
        <div className={styles.reactionTextSkeleton}></div>
        <div className={styles.reactionButtons}>
          <div className={styles.reactionButtonSkeleton}></div>
          <div className={styles.reactionButtonSkeleton}></div>
          <div className={styles.reactionButtonSkeleton}></div>
        </div>
      </div>
    </div>
  );
}
