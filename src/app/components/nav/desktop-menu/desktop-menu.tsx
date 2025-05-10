"use client";

import { signOut } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";

import { Menu } from "@base-ui-components/react/menu";

import { LogOut, Settings, User } from "lucide-react";
import { buttonVariants } from "../../ui/button";
import type { MenuProps } from "../menuProps";

function DesktopMenu({ profileIcon, username }: MenuProps) {
  const handleSignOut = async () => {
    await signOut({ redirectTo: "/" });
  };

  return (
    <div className="hidden md:block">
      {username ? (
        <Menu.Root modal={false}>
          <Menu.Trigger className="bg-background border-none rounded-full cursor-pointer flex items-center justify-center gap-1.5 m-0 outline-0 w-10 h-10 focus:outline-2 focus:outline-offset-2 relative">
            {profileIcon && (
              <Image
                src={profileIcon}
                fill
                className="object-cover rounded-full"
                alt="Menu"
              />
            )}
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner
              className="outline-0 isolate z-100"
              sideOffset={7}
              alignOffset={-77}
              sticky={true}
            >
              <Menu.Popup className="w-50 origin-[var(--transform-origin)] rounded-lg py-1 shadow-lg shadow-gray-200 outline outline-border transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 bg-background dark:shadow-none dark:-outline-offset-1">
                <Menu.Item
                  className="flex items-center gap-2.5 cursor-pointer py-[9px] px-3.5 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0  data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-accent"
                  render={
                    <Link
                      href={`/user/${username}`}
                      className="block w-full h-full"
                    >
                      <User className="w-5 h-5" />
                      My Profile
                    </Link>
                  }
                />
                <Menu.Item className="flex items-center gap-2.5 cursor-pointer py-[9px] px-3.5 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0  data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-accent">
                  <Settings className="w-5 h-5" />
                  Settings
                </Menu.Item>
                <Menu.Separator className="my-1.5 mx-4 h-[1px] bg-muted" />
                <Menu.Item
                  className="flex items-center gap-2.5 cursor-pointer py-[9px] px-3.5 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0  data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-accent"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      ) : (
        <Link
          href="/sign-in"
          className={buttonVariants({ variant: "outline" })}
        >
          Sign In
        </Link>
      )}
    </div>
  );
}

export default DesktopMenu;
