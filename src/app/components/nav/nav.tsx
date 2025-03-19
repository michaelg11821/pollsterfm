"use client";

import { useState } from "react";

import Link from "next/link";

import ProfileIcon from "../profile-icon/profile-icon"; // profile icon DROPDOWN

import styles from "./nav.module.css";
import MobileMenu from "./mobile-menu/mobile-menu";

type NavProps = {
  profileIcon: string | null | undefined;
};

function Nav({ profileIcon }: NavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <>
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
        {/* shows on desktop */}
        <div className={styles.profileIconWrapper}>
          <ProfileIcon profileIcon={profileIcon} />
        </div>
        {/* shows on mobile */}
        <div className={styles.mobileMenuToggleWrapper}>
          <button
            type="button"
            className={
              mobileMenuOpen
                ? styles.mobileMenuToggleActive
                : styles.mobileMenuToggle
            }
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
      {mobileMenuOpen && <MobileMenu profileIcon={profileIcon} />}
    </>
  );
}

export default Nav;
