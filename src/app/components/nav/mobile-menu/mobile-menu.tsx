"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

import Link from "next/link";
import Image from "next/image";

import MenuSvg from "../../../../../public/ellipsis.svg";
import CloseMenuSvg from "../../../../../public/x.svg";

import styles from "./mobile-menu.module.css";

type MobileMenuProps = {
  profileIcon: string | null | undefined;
};

function MobileMenu({ profileIcon }: MobileMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleSignOut = async () => {
    await signOut({ redirectTo: "/ " });
  };

  return (
    <>
      <div className={styles.mobileMenuToggleWrapper}>
        <button
          type="button"
          className={styles.mobileMenuToggle}
          title="Toggle menu"
          aria-label={`${mobileMenuOpen ? "Close" : "Open"} menu`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Image
            src={mobileMenuOpen ? CloseMenuSvg : MenuSvg}
            width={30}
            height={30}
            alt=""
          />
        </button>
      </div>
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div
            className={styles.mobileMenuInteriorWrapper}
            onClick={() => setMobileMenuOpen(false)}
          >
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
                <li style={{ marginBottom: "-20px" }}>
                  <button type="button">
                    <Link href="sign-in">Sign In</Link>
                  </button>
                </li>
              )}
            </ul>
            <ul className={styles.navLinks}>
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
