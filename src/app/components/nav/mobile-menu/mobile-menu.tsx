"use client";

import Link from "next/link";

import styles from "./mobile-menu.module.css";
import Image from "next/image";

type MobileMenuProps = {
  profileIcon: string | null | undefined;
};

function MobileMenu({ profileIcon }: MobileMenuProps) {
  return (
    <div className={styles.mobileMenu}>
      <div className={styles.mobileMenuInteriorWrapper}>
        <ul className={styles.accountOptions}>
          <li>
            <button type="button" className={styles.profileBtn}>
              <Image
                src={profileIcon ? profileIcon : ""}
                width={35}
                height={35}
                alt=""
              />
              <Link href="profile">Your Profile</Link>
            </button>
          </li>
          <li>
            <button type="button">
              <Link href="">Account Settings</Link>
            </button>
          </li>
          <li>
            <button type="button">
              <Link href="">Log Out</Link>
            </button>
          </li>
        </ul>
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
    </div>
  );
}

export default MobileMenu;
