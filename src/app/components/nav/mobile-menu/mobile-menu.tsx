"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Menu, X } from "lucide-react";
import { MenuProps } from "../menuProps";

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
          className="flex flex-col justify-center items-center bg-inherit transition-[background-color] w-10 h-10 border-none rounded-lg p-1.5 cursor-pointer hover:bg-accent"
          title="Toggle menu"
          aria-label={`${mobileMenuOpen ? "Close" : "Open"} menu`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-7.5 h-7.5" />
          ) : (
            <Menu className="w-7.5 h-7.5" />
          )}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="mt-12.5 -ml-5 absolute z-50 w-full md:hidden">
          <div
            className="flex flex-col bg-background gap-5 w-full h-screen z-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ul className="flex flex-col gap-2.5 list-none">
              {username ? (
                <>
                  <li>
                    <Link
                      href={`/user/${username}`}
                      className="bg-inherit w-full h-12.5 pl-5 border-none rounded-[10px] transition-[background-color] text-left text-lg cursor-pointer hover:bg-accent flex items-center gap-2.5"
                    >
                      {profileIcon && (
                        <div className="w-9 h-9 relative">
                          <Image
                            src={profileIcon}
                            fill
                            className="object-cover rounded-full"
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
                      className="bg-inherit w-full h-12.5 pl-5 border-none rounded-[10px] transition-[background-color] text-left text-lg cursor-pointer flex items-center hover:bg-accent"
                    >
                      Account Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="bg-inherit w-full h-12.5 pl-5 border-none rounded-[10px] transition-[background-color] text-left text-lg cursor-pointer flex items-center hover:bg-accent"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="sign-in"
                    className="-mb-5 bg-inherit w-full h-12.5 pl-5 border-none rounded-[10px] transition-[background-color] text-left text-lg cursor-pointer flex items-center hover:bg-accent"
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
            <ul className="flex flex-col gap-2.5 list-none border-t py-5">
              <li>
                <Link
                  href=""
                  className="bg-inherit w-full h-12.5 pl-5 border-none rounded-[10px] transition-[background-color] text-left text-lg cursor-pointer flex items-center hover:bg-accent"
                >
                  Polls
                </Link>
              </li>
              <li>
                <Link
                  href=""
                  className="bg-inherit w-full h-12.5 pl-5 border-none rounded-[10px] transition-[background-color] text-left text-lg cursor-pointer flex items-center hover:bg-accent"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href=""
                  className="bg-inherit w-full h-12.5 pl-5 border-none rounded-[10px] transition-[background-color] text-left text-lg cursor-pointer flex items-center hover:bg-accent"
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
