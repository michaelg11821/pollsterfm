import Image from "next/image";

import RightArrow from "../../public/arrow-right.svg";
import SearchIcon from "../../public/search.svg";
import RightChevron from "../../public/chevron-right.svg";
import UsersIcon from "../../public/users.svg";

import styles from "./page.module.css";

function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.backgroundContainer}>
          <div className={styles.backgroundCircle1}></div>
          <div className={styles.backgroundCircle2}></div>
        </div>

        <div className={styles.sectionWrapper}>
          <div className={styles.contentWrapper}>
            <h2 className={styles.heading}>
              Your <span className={styles.highlight}>opinion</span> matters.
            </h2>
            <p className={styles.description}>
              Vote in polls, create reviews, and discover people who experience
              music like you do.
            </p>
            <div className={styles.buttonGroup}>
              <button type="button" className={styles.primaryButton}>
                Get started{" "}
                <Image src={RightArrow} width={20} height={20} alt="" />
              </button>
              <button type="button" className={styles.outlineButton}>
                How it works
              </button>
            </div>
          </div>

          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <Image src={SearchIcon} width={20} height={20} alt="" />
              <input
                type="text"
                placeholder="Search for music, affinities, or people..."
                className={styles.searchInput}
              />
              <button className={styles.searchButton}>Search</button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.popularSection}>
        <div className={styles.sectionWrapper}>
          <div className={styles.header}>
            <div>
              <h2 className={styles.title}>Popular Polls</h2>
              <p className={styles.description}>
                Discover what the community is voting on and add your voice to
                the conversation.
              </p>
            </div>
            <button className={styles.viewButton}>
              View All Polls{" "}
              <Image src={RightChevron} width={20} height={20} alt="" />
            </button>
          </div>

          <div className={styles.pollGrid}>
            {[
              {
                title: "Best Albums of 2023",
                votes: 1243,
                affinities: ["Contemporary", "Diverse"],
                hot: true,
              },
              {
                title: "Most Energetic Workout Songs",
                votes: 876,
                affinities: ["Energetic", "Motivational"],
              },
              {
                title: "Albums That Define Gen Z",
                votes: 754,
                affinities: ["Cultural", "Defining"],
              },
              {
                title: "Best Vocal Performances",
                votes: 692,
                affinities: ["Technical", "Emotional"],
              },
              {
                title: "Most Innovative Production",
                votes: 587,
                affinities: ["Experimental", "Creative"],
              },
              {
                title: "Songs That Make You Cry",
                votes: 521,
                affinities: ["Emotional", "Vulnerable"],
              },
            ].map((poll, i) => (
              <div key={i} className={styles.pollCard}>
                <div className={styles.cardHeader}>
                  <h4 className={styles.cardTitle}>{poll.title}</h4>
                  {poll.hot && (
                    <span className={styles.hotTag}>
                      <span className={styles.hotIndicator}></span>
                      HOT
                    </span>
                  )}
                </div>

                <div className={styles.affinityTags}>
                  {poll.affinities.map((affinity, j) => (
                    <span key={j} className={styles.affinityTag}>
                      {affinity}
                    </span>
                  ))}
                </div>

                <div className={styles.voteCount}>
                  <Image
                    src={UsersIcon}
                    width={20}
                    height={20}
                    className={styles.voteIcon}
                    alt=""
                  />
                  <span>{poll.votes} votes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="affinities" className={styles.affinitiesSection}>
        <div className={styles.sectionWrapper}>
          <div className={styles.header}>
            <div>
              <h2 className={styles.title}>Discover Through Affinities</h2>
              <p className={styles.description}>
                Affinities connect you with people who feel the same way about
                music.
              </p>
            </div>
            <button className={styles.viewButton}>
              View All Affinities{" "}
              <Image src={RightChevron} width={20} height={20} alt="" />
            </button>
          </div>

          <div className={styles.affinityGrid}>
            {[
              { name: "Introspective" },
              { name: "Energetic" },
              { name: "Melancholic" },
              { name: "Euphoric" },
              { name: "Nostalgic" },
              { name: "Atmospheric" },
              { name: "Dreamy" },
              { name: "Intense" },
              { name: "Soothing" },
              { name: "Rebellious" },
              { name: "Ethereal" },
              { name: "Passionate" },
            ].map((affinity, i) => (
              <div key={i} className={styles.affinityCard}>
                <span className={styles.affinityName}>{affinity.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
