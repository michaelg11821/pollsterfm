"use client";

import { signOut } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";

import styles from "./profile-icon.module.css";

interface ProfileIconProps {
  profileIcon: string | null | undefined;
}

function ProfileIcon({ profileIcon }: ProfileIconProps) {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className={styles.profileIconWrapper}>
      {profileIcon ? (
        <button
          type="button"
          title="Your profile"
          className={styles.profileIcon}
          onClick={handleSignOut}
        >
          <Image src={profileIcon} width={40} height={40} alt="Profile" />
        </button>
      ) : (
        <button type="button">
          <Link href="/sign-in">Sign in</Link>
        </button>
      )}
    </div>
  );
}

export default ProfileIcon;
