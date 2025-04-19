"use client";

import { signOut } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";

import { Menu } from "@base-ui-components/react/menu";

import { type MenuProps } from "../menuProps";

import ProfileSvg from "../../../../../public/user.svg";
import SettingsSvg from "../../../../../public/settings.svg";
import SignOutSvg from "../../../../../public/log-out.svg";

import styles from "./desktop-menu.module.css";

function DesktopMenu({ profileIcon, username }: MenuProps) {
  const handleSignOut = async () => {
    await signOut({ redirectTo: "/" });
  };

  return (
    <div className={styles.profileIconWrapper}>
      {username ? (
        <Menu.Root modal={false}>
          <Menu.Trigger className={styles.profileIcon}>
            {profileIcon && (
              <Image src={profileIcon} width={40} height={40} alt="Menu" />
            )}
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner
              className={styles.Positioner}
              sideOffset={7}
              alignOffset={-77}
              sticky={true}
            >
              <Menu.Popup className={styles.Popup}>
                <Menu.Item
                  className={styles.Item}
                  render={
                    <Link href={`/user/${username}`}>
                      <Image src={ProfileSvg} width={20} height={20} alt="" />{" "}
                      My Profile
                    </Link>
                  }
                />
                <Menu.Item className={styles.Item}>
                  <Image src={SettingsSvg} width={20} height={20} alt="" />{" "}
                  Settings
                </Menu.Item>
                <Menu.Separator className={styles.Separator} />
                <Menu.Item className={styles.Item} onClick={handleSignOut}>
                  <Image src={SignOutSvg} width={20} height={20} alt="" /> Sign
                  Out
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
