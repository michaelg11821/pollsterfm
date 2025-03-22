"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

import Link from "next/link";
import Image from "next/image";

import styles from "./mobile-menu.module.css";

type MobileMenuProps = {
  profileIcon: string | null | undefined;
};

function MobileMenu({ profileIcon }: MobileMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <div className={styles.mobileMenuToggleWrapper}>
        <button
          type="button"
          className={
            mobileMenuOpen
              ? styles.mobileMenuToggleActive
              : styles.mobileMenuToggle
          }
          title="Toggle menu"
          aria-label={`${mobileMenuOpen ? "Close" : "Open"} menu`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuInteriorWrapper}>
            <ul className={styles.accountOptions}>
              {profileIcon ? (
                <>
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
                    <button type="button" onClick={handleSignOut}>
                      <Link href="">Sign Out</Link>
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button type="button">
                    <Link href="sign-in">Sign In</Link>
                  </button>
                </li>
              )}
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
      )}
    </>
  );
}

export default MobileMenu;
