import styles from "./skeleton.module.css";

function AffinitiesSkeleton() {
  const placeholderItems: null[] = Array(6).fill(null);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Affinities</h2>
        <p className={styles.viewAll}>View All</p>
      </div>

      <div className={styles.list}>
        {placeholderItems.map((_, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.itemHeader}>
              <div className={styles.nameSkeleton}></div>
              <div className={styles.scoreSkeleton}></div>
            </div>
            <div className={styles.progressBarSkeleton}></div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <h5 className={styles.footerTitle}>What are affinities?</h5>
        <p className={styles.footerText}>
          Affinities help connect you with people who experience music the same
          way you do.
        </p>
      </div>
    </div>
  );
}

export default AffinitiesSkeleton;
