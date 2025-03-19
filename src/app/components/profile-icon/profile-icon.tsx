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

  return profileIcon ? (
    <button
      type="button"
      className={styles.profileIcon}
      onClick={handleSignOut}
    >
      <Image src={profileIcon} width={40} height={40} alt="Profile" />
    </button>
  ) : (
    <button type="button">
      <Link href="/sign-in">Sign in</Link>
    </button>
  );
}

export default ProfileIcon;
