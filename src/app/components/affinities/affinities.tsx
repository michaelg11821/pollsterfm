import Link from "next/link";

import styles from "./affinities.module.css";

async function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function Affinities() {
  await waitFor(400);

  const temporaryAffinities = [
    { name: "Nostalgic", score: 92 },
    { name: "Atmospheric", score: 87 },
    { name: "Melancholic", score: 83 },
    { name: "Introspective", score: 78 },
    { name: "Ethereal", score: 76 },
    { name: "Warm", score: 71 },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Affinities</h2>
        <Link href="" className={styles.viewAll}>
          View All
        </Link>
      </div>

      <div className={styles.list}>
        {temporaryAffinities.map((affinity, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.itemHeader}>
              <span className={styles.itemName}>{affinity.name}</span>
              <span className={styles.itemScore}>{affinity.score}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${affinity.score}%` }}
              ></div>
            </div>
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

export default Affinities;
