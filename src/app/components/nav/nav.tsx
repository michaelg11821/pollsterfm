"use client";

import Link from "next/link";

import DesktopMenu from "./desktop-menu/desktop-menu";
import MobileMenu from "./mobile-menu/mobile-menu";

import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import DesktopSearch from "./desktop-search/desktop-search";
import MobileSearch from "./mobile-search/mobile-search";
import NavSkeleton from "./skeleton";

function Nav() {
  const currentUserProfile = useQuery(api.user.getProfile, {});

  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("query");

  if (currentUserProfile === undefined) {
    return <NavSkeleton />;
  }

  return (
    <header className="bg-background sticky top-0 z-50 flex h-16 w-full items-center border-b px-5 py-3">
      <div className="content-wrapper flex w-full items-center">
        <nav className="flex w-full items-center justify-between">
          <div className="flex items-center gap-12.5">
            <h1 className="text-2xl font-semibold">
              <Link href="/">{SITE_NAME}</Link>
            </h1>
            <ul className="hidden list-none md:flex md:gap-6">
              <li>
                <Link
                  href="/polls"
                  className="text-muted-foreground hover:text-foreground text-center transition-[color]"
                >
                  Polls
                </Link>
              </li>
              <li>
                <Link
                  href=""
                  className="text-muted-foreground hover:text-foreground text-center transition-[color]"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href=""
                  className="text-muted-foreground hover:text-foreground text-center transition-[color]"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <DesktopSearch initialQuery={searchQuery} />
          <div className="md:hidden">
            <MobileSearch initialQuery={searchQuery} />
          </div>
        </nav>
        <DesktopMenu
          profileIcon={currentUserProfile?.image}
          username={currentUserProfile?.username}
        />
        <MobileMenu
          profileIcon={currentUserProfile?.image}
          username={currentUserProfile?.username}
        />
      </div>
    </header>
  );
}

export default Nav;
