import { auth } from "@/auth";

import Link from "next/link";

import DesktopMenu from "./desktop-menu/desktop-menu";
import MobileMenu from "./mobile-menu/mobile-menu";

import styles from "./nav.module.css";

async function Nav() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className={styles.pageHeader}>
      <div className={styles.pageHeaderContentWrapper}>
        <nav className={styles.navBar}>
          <div className={styles.logoAndLinks}>
            <h1 className={styles.logoText}>
              <Link href="/">Pollster.fm</Link>
            </h1>
            <ul className={styles.navLinks}>
              <li>
                <Link href="">Polls</Link>
              </li>
              <li>
                <Link href="">Reviews</Link>
              </li>
              <li>
                <Link href="">Community</Link>
              </li>
            </ul>
          </div>
          <div className={styles.searchBar}>search...</div>
        </nav>
        <DesktopMenu profileIcon={user?.image} />
        <MobileMenu profileIcon={user?.image} />
      </div>
    </header>
  );
}

export default Nav;
