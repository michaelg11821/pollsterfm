import styles from "./skeleton.module.css";

function TrackSkeleton() {
  return (
    <div className={`${styles.skeletonContainer}`}>
      <div className={styles.skeletonImage}></div>

      <div>
        <div className={`${styles.skeletonText} ${styles.skeletonTitle}`}></div>
        <div
          className={`${styles.skeletonText} ${styles.skeletonArtist}`}
        ></div>
      </div>

      <div className={styles.skeletonTimestamp}></div>
    </div>
  );
}

export default TrackSkeleton;
