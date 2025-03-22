import { auth } from "@/auth";

import Nav from "./components/nav/nav";

import MobileMenu from "./components/mobile-menu/mobile-menu";
import DesktopMenu from "./components/desktop-menu/desktop-menu";

import styles from "./page.module.css";

async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <header>
        <div className="header-content-wrapper">
          <Nav />
          <DesktopMenu profileIcon={user?.image} />
          <MobileMenu profileIcon={user?.image} />
        </div>
      </header>
      <main>
        <section className={styles.hero}>
          <div className={styles.backgroundLayer}>
            <div className={styles.gradientOverlay}></div>
            <div className={styles.radialOverlay}></div>
            <div className={styles.gridOverlay}>
              <div className={styles.animatedCircleOne}></div>
              <div className={styles.animatedCircleTwo}></div>
              <div className={styles.animatedCircleThree}></div>
            </div>
          </div>

          <div className={styles.heroContentWrapper}>
            <p className={styles.slogan}>Your opinion matters.</p>
            <p className={styles.pollsterSummary}>
              Create engaging music polls, vote on your favorite topics, publish
              reviews, and discover like-minded people.
            </p>
            <button type="button" className={styles.getStarted}>
              Get Started
            </button>
          </div>
        </section>
        <section className={styles.statsSection}>stats go here</section>
      </main>
    </>
  );
}

export default Home;
