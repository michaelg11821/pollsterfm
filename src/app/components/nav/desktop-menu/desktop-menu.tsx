"use client";

import { signOut } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";

import { Menu } from "@base-ui-components/react/menu";

import { LogOut, Settings, User } from "lucide-react";
import ThemeToggle from "../../theme-toggle";
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
          <Menu.Trigger className="bg-background relative m-0 flex h-10 w-10 cursor-pointer items-center justify-center gap-1.5 rounded-full border-none outline-0 focus:outline-2 focus:outline-offset-2">
            {profileIcon && (
              <Image
                src={profileIcon}
                fill
                className="rounded-full object-cover"
                alt="Menu"
              />
            )}
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner
              className="isolate z-100 outline-0"
              sideOffset={7}
              alignOffset={-77}
              sticky={true}
            >
              <Menu.Popup className="outline-border bg-background w-50 origin-[var(--transform-origin)] rounded-lg py-1 shadow-lg shadow-gray-200 outline transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1">
                <Menu.Item
                  className="data-[highlighted]:before:bg-accent flex cursor-pointer items-center gap-2.5 px-3.5 py-[9px] text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm"
                  render={
                    <Link
                      href={`/user/${username}`}
                      className="block h-full w-full"
                    >
                      <User className="h-5 w-5" />
                      My Profile
                    </Link>
                  }
                />
                <Menu.Item className="data-[highlighted]:before:bg-accent flex cursor-pointer items-center gap-2.5 px-3.5 py-[9px] text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm">
                  <Settings className="h-5 w-5" />
                  Settings
                </Menu.Item>
                <Menu.Separator className="bg-muted mx-4 my-1.5 h-[1px]" />
                <Menu.Item className="flex items-center gap-2.5 px-3.5 py-[9px] text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm">
                  <ThemeToggle />
                  Appearance
                </Menu.Item>
                <Menu.Separator className="bg-muted mx-4 my-1.5 h-[1px]" />
                <Menu.Item
                  className="data-[highlighted]:before:bg-accent flex cursor-pointer items-center gap-2.5 px-3.5 py-[9px] text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" /> Sign Out
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
