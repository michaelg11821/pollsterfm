import Link from "next/link";

import DesktopMenu from "./desktop-menu/desktop-menu";
import MobileMenu from "./mobile-menu/mobile-menu";

import { siteName } from "@/config";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";

async function Nav() {
  const token = await convexAuthNextjsToken();
  const user = await fetchQuery(api.user.currentUser, {}, { token });

  return (
    <header className="bg-background sticky top-0 z-50 flex h-16 w-full items-center border-b px-5 py-3">
      <div className="content-wrapper flex w-full items-center">
        <nav className="flex w-full items-center justify-between">
          <div className="flex items-center gap-12.5">
            <h1 className="text-2xl font-semibold">
              <Link href="/">{siteName}</Link>
            </h1>
            <ul className="hidden list-none md:flex md:gap-6">
              <li>
                <Link
                  href=""
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
          <div className="hidden">search...</div>
        </nav>
        <DesktopMenu profileIcon={user?.image} username={user?.username} />
        <MobileMenu profileIcon={user?.image} username={user?.username} />
      </div>
    </header>
  );
}

export default Nav;
