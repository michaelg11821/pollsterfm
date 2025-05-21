"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Menu, X } from "lucide-react";
import ThemeToggle from "../../theme-toggle";
import type { MenuProps } from "../menuProps";

function MobileMenu({ profileIcon, username }: MenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleSignOut = async () => {
    await signOut({ redirectTo: "/" });
  };

  return (
    <>
      <div className="md:hidden">
        <button
          type="button"
          className="hover:bg-accent flex h-10 w-10 cursor-pointer flex-col items-center justify-center rounded-lg border-none bg-inherit p-1.5 transition-[background-color]"
          title="Toggle menu"
          aria-label={`${mobileMenuOpen ? "Close" : "Open"} menu`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-7.5 w-7.5" />
          ) : (
            <Menu className="h-7.5 w-7.5" />
          )}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="absolute top-0 z-50 mt-16 -ml-5 w-full md:hidden">
          <div
            className="bg-background/90 z-50 flex h-screen w-full flex-col"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ul className="flex list-none flex-col gap-2.5 pt-5">
              {username ? (
                <>
                  <li>
                    <Link
                      href={`/user/${username}`}
                      className="hover:bg-accent flex h-12.5 w-full cursor-pointer items-center gap-2.5 rounded-[10px] border-none bg-inherit pl-5 text-left text-lg transition-[background-color]"
                    >
                      {profileIcon && (
                        <div className="relative h-9 w-9">
                          <Image
                            src={profileIcon}
                            fill
                            className="rounded-full object-cover"
                            alt=""
                          />
                        </div>
                      )}
                      <span className="flex-1">Your Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href=""
                      className="hover:bg-accent flex h-12.5 w-full cursor-pointer items-center rounded-[10px] border-none bg-inherit pl-5 text-left text-lg transition-[background-color]"
                    >
                      Account Settings
                    </Link>
                  </li>
                  <ul className="list-none border-t py-1">
                    <li className="flex h-12.5 w-full items-center gap-2.5 rounded-[10px] border-none bg-inherit pl-5 text-left text-lg">
                      <ThemeToggle />
                      Appearance
                    </li>
                  </ul>
                  <ul className="list-none border-t py-2">
                    <li>
                      <button
                        type="button"
                        className="hover:bg-accent flex h-12.5 w-full cursor-pointer items-center rounded-[10px] border-none bg-inherit pl-5 text-left text-lg transition-[background-color]"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </>
              ) : (
                <li>
                  <Link
                    href="sign-in"
                    className="hover:bg-accent -mb-5 flex h-12.5 w-full cursor-pointer items-center rounded-[10px] border-none bg-inherit pl-5 text-left text-lg transition-[background-color]"
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
            <ul className="flex list-none flex-col gap-2.5 border-t py-5">
              <li>
                <Link
                  href=""
                  className="hover:bg-accent flex h-12.5 w-full cursor-pointer items-center rounded-[10px] border-none bg-inherit pl-5 text-left text-lg transition-[background-color]"
                >
                  Polls
                </Link>
              </li>
              <li>
                <Link
                  href=""
                  className="hover:bg-accent flex h-12.5 w-full cursor-pointer items-center rounded-[10px] border-none bg-inherit pl-5 text-left text-lg transition-[background-color]"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href=""
                  className="hover:bg-accent flex h-12.5 w-full cursor-pointer items-center rounded-[10px] border-none bg-inherit pl-5 text-left text-lg transition-[background-color]"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileMenu;
