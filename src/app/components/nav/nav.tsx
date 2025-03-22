import Link from "next/link";

import styles from "./nav.module.css";

function Nav() {
  return (
    <nav className={styles.navBar}>
      <div className={styles.logoAndLinks}>
        <h1 className={styles.logoText}>Pollster.fm</h1>
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
  );
}

export default Nav;
