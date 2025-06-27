"use client";

import { useAuthActions } from "@convex-dev/auth/react";

import Image from "next/image";
import Link from "next/link";

import { LogOut, Settings, User } from "lucide-react";
import ThemeToggle from "../../theme-toggle";
import { buttonVariants } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import type { MenuProps } from "../menuProps";

function DesktopMenu({ profileIcon, username }: MenuProps) {
  const { signOut } = useAuthActions();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="hidden md:block">
      {username ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="bg-background relative m-0 flex h-10 w-10 cursor-pointer items-center justify-center gap-1.5 rounded-full border-none outline-0 focus:outline-2 focus:outline-offset-2">
            {profileIcon && (
              <Image
                src={profileIcon}
                fill
                className="rounded-full object-cover"
                alt="Menu"
              />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            sideOffset={7}
            alignOffset={-77}
            sticky={true}
            className="outline-border bg-background w-50 origin-[var(--transform-origin)] rounded-lg py-1 shadow-lg shadow-gray-200 outline transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1"
          >
            <DropdownMenuItem
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
            <DropdownMenuItem className="data-[highlighted]:before:bg-accent flex cursor-pointer items-center gap-2.5 px-3.5 py-[9px] text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm">
              <Settings className="h-5 w-5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="data-[highlighted]:before:bg-background flex cursor-default items-center gap-2.5 px-3.5 py-0.5 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm">
              <ThemeToggle />
              Appearance
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="data-[highlighted]:before:bg-accent flex cursor-pointer items-center gap-2.5 px-3.5 py-[9px] text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
