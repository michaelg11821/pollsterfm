"use client";

import { User } from "next-auth";
import { signOut } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";

interface ProfileIconProps {
  user: User | undefined;
}

function ProfileIcon({ user }: ProfileIconProps) {
  const handleSignOut = async () => {
    await signOut();
  };

  return user ? (
    <button type="button" onClick={handleSignOut}>
      <Image src={String(user.image)} width={30} height={30} alt="Profile" />
    </button>
  ) : (
    <button type="button">
      <Link href="/sign-in">Sign in</Link>
    </button>
  );
}

export default ProfileIcon;
