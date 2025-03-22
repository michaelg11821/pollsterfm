"use client";

import { signOut } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";

import styles from "./desktop-menu.module.css";

interface DesktopMenuProps {
  profileIcon: string | null | undefined;
}

function DesktopMenu({ profileIcon }: DesktopMenuProps) {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className={styles.profileIconWrapper}>
      {profileIcon ? (
        <button
          type="button"
          title="Menu"
          className={styles.profileIcon}
          onClick={handleSignOut}
        >
          <Image src={profileIcon} width={40} height={40} alt="Profile Icon" />
        </button>
      ) : (
        <button type="button">
          <Link href="/sign-in">Sign In</Link>
        </button>
      )}
    </div>
  );
}

export default DesktopMenu;
