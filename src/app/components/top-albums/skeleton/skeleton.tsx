import { Star } from "lucide-react";
import styles from "./skeleton.module.css";

function TopAlbumsSkeleton() {
  return (
    <div>
      <div className={styles.albumsSectionHeader}>
        <div className={styles.albumsSectionTitleSkeleton}></div>
        <div className={styles.albumsViewAllButtonSkeleton}></div>
      </div>
      <div className={styles.albumsGridContainer}>
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <div key={index} className={styles.albumCardLink}>
              <div className={styles.albumImageWrapper}>
                <div className={styles.albumImageSkeleton}></div>
              </div>
              <div className={styles.albumNameHeadingSkeleton}></div>
              <div className={styles.albumMetadata}>
                <div className={styles.albumYearTextSkeleton}></div>
                <div className={styles.albumRatingContainer}>
                  <Star className={styles.albumRatingStarIcon} />
                  <div className={styles.albumRatingValueTextSkeleton}></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default TopAlbumsSkeleton;
