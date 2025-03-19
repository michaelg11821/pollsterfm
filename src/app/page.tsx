import { auth } from "@/auth";

import Nav from "./components/nav/nav";

import MobileMenu from "./components/mobile-menu/mobile-menu";
import ProfileIcon from "./components/profile-icon/profile-icon";

import styles from "./page.module.css";

async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <header className={styles.homeHeader}>
        <Nav />
        {/* shows on desktop */}
        <ProfileIcon profileIcon={user?.image} />
        {/* shows on mobile */}
        <MobileMenu profileIcon={user?.image} />
      </header>
      <main>
        <p>coming soon</p>
        <p>sign in, then see the mobile layout</p>
      </main>
    </>
  );
}

export default Home;
