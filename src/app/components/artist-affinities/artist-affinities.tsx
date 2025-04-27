import styles from "./artist-affinities.module.css";

function ArtistAffinities() {
  const topAffinities = [
    { name: "Introspective", score: 95 },
    { name: "Atmospheric", score: 92 },
    { name: "Melancholic", score: 89 },
    { name: "Experimental", score: 87 },
  ];

  return (
    <div className={styles.affinitiesCardContainer}>
      <h2 className={styles.affinitiesCardHeading}>Artist Affinities</h2>
      <div className={styles.affinitiesListingArea}>
        {topAffinities.map((affinity, i) => (
          <div key={i} className={styles.affinityEntry}>
            <div className={styles.affinityEntryHeader}>
              <span className={styles.affinityAudienceName}>
                {affinity.name}
              </span>
              <span className={styles.affinityPercentageScore}>
                {affinity.score}%
              </span>
            </div>
            <div className={styles.affinityMeterBackground}>
              <div
                className={styles.affinityMeterForeground}
                style={{ width: `${affinity.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtistAffinities;
