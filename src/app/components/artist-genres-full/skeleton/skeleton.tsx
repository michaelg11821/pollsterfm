import Link from "next/link";
import styles from "./skeleton.module.css";

export default function ArtistGenresFullSkeleton() {
  return (
    <>
      <Link href="#" className={styles.genresBackLink}>
        <div className={styles.genresBackLinkTextSkeleton}></div>
      </Link>
      <div className={styles.genresHeaderRow}>
        <div className={styles.genresHeaderImageWrapper}>
          <div className={styles.genresHeaderImageSkeleton}></div>
        </div>
        <div>
          <div className={styles.genresHeaderArtistNameSkeleton}></div>
          <div className={styles.genresHeaderSubtitleSkeleton}></div>
        </div>
      </div>
      <div className={styles.genresMainGrid}>
        <div className={styles.genresListCard}>
          <div className={styles.genresListCardContent}>
            <div className={styles.genresListGrid}>
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className={styles.genreListItem}>
                    <div className={styles.genreListItemNameSkeleton}></div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
