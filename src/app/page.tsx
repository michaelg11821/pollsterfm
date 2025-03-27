import styles from "./page.module.css";

function Home() {
  return (
    <main>
      <section id="hero" className={styles.hero}>
        <div className={styles.backgroundContainer}>
          <div className={styles.gradientBackground}>
            <div className={styles.overlay}>
              <div className={styles.radialGradient1}></div>
              <div className={styles.radialGradient2}></div>
            </div>
            <div className={styles.shapesContainer}>
              <div className={styles.blob1}></div>
              <div className={styles.blob2}></div>
              <div className={styles.blob3}></div>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.content}>
            <h2 className={styles.title}>Your taste, your opinion.</h2>
            <p className={styles.description}>
              Discover yourself through the rhythm of your choices.
            </p>
            <div className={styles.buttonContainer}>
              <button className={styles.primaryButton}>Start Voting</button>
              <button className={styles.secondaryButton}>Create Poll</button>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.statsSection}>stats go here</section>
    </main>
  );
}

export default Home;
