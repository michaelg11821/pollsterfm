import Image from "next/image";

import styles from "./top-listeners.module.css";

const topListenersData = [
  { username: "musicphilosopher", plays: 142, image: null, match: 96 },
  {
    username: "ambientwaves",
    plays: 118,
    image: null,
    match: 92,
  },
  {
    username: "melancholymuse",
    plays: 103,
    image: null,
    match: 89,
  },
  {
    username: "soundexplorer",
    plays: 87,
    image: null,
    match: 85,
  },
  { username: "vinylcollector", plays: 76, image: null, match: 82 },
  {
    username: "indieheaven",
    plays: 64,
    image: null,
    match: 79,
  },
];

async function TopListeners() {
  // use spotify / last fm / other platform to gauge this stat

  return (
    <section className={styles.listenersSection}>
      <div className={styles.listenersHeader}>
        <h2 className={styles.sectionTitle}>Top Listeners</h2>
        <button className={`${styles.button} ${styles.buttonOutline}`}>
          View All Listeners
        </button>
      </div>

      <div className={styles.listenersGrid}>
        {topListenersData.map((user, i) => (
          <div key={i} className={styles.listenerCard}>
            <div className={styles.listenerCardContent}>
              <div className={styles.listenerAvatar}>
                {/* Basic Avatar */}
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.username}
                    width={48}
                    height={48}
                    className={styles.avatarImage}
                  />
                ) : (
                  <span>{user.username.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className={styles.listenerInfo}>
                <p className={styles.listenerUsername}>@{user.username}</p>
                <div className={styles.listenerMeta}>
                  <span className={`${styles.badge} ${styles.badgeMatch}`}>
                    {user.match}% match
                  </span>
                  <span className={styles.listenerPlays}>
                    {user.plays} plays
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TopListeners;
