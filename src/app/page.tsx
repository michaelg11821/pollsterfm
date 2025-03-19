import Nav from "./components/nav/nav";

import styles from "./page.module.css";
import MobileMenu from "./components/nav/mobile-menu/mobile-menu";
import { auth } from "@/auth";
import ProfileIcon from "./components/profile-icon/profile-icon";

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
