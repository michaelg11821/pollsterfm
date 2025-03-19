import Link from "next/link";

import styles from "./nav.module.css";

function Nav() {
  return (
    <nav className={styles.navBar}>
      <div className={styles.logoAndLinks}>
        <h1 className={styles.logoText}>Pollster.fm</h1>
        <ul className={styles.navLinks}>
          <li>
            <button type="button">
              <Link href="">Discover</Link>
            </button>
          </li>
          <li>
            <button type="button">
              <Link href="">Polls</Link>
            </button>
          </li>
          <li>
            <button type="button">
              <Link href="">Reviews</Link>
            </button>
          </li>
          <li>
            <button type="button">
              <Link href="">Community</Link>
            </button>
          </li>
        </ul>
      </div>
      <div className={styles.searchBar}>search...</div>
    </nav>
  );
}

export default Nav;
