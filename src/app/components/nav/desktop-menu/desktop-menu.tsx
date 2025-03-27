"use client";

import { signOut } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";

import { Menu } from "@base-ui-components/react/menu";

import styles from "./desktop-menu.module.css";

interface DesktopMenuProps {
  profileIcon: string | null | undefined;
}

function DesktopMenu({ profileIcon }: DesktopMenuProps) {
  const handleSignOut = async () => {
    await signOut({ redirectTo: "/ " });
  };

  return (
    <div className={styles.profileIconWrapper}>
      {profileIcon ? (
        <Menu.Root>
          <Menu.Trigger className={styles.profileIcon}>
            <Image src={profileIcon} width={40} height={40} alt="Menu" />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner
              className={styles.Positioner}
              sideOffset={7}
              alignOffset={-45}
            >
              <Menu.Popup className={styles.Popup}>
                <Menu.Item
                  className={styles.Item}
                  render={<Link href="profile">My Profile</Link>}
                />
                <Menu.Item className={styles.Item}>Settings</Menu.Item>
                <Menu.Separator className={styles.Separator} />
                <Menu.Item className={styles.Item} onClick={handleSignOut}>
                  Sign Out
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      ) : (
        <Link href="/sign-in" className={styles.signInBtn}>
          Sign In
        </Link>
      )}
    </div>
  );
}

export default DesktopMenu;
