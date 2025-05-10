import { auth } from "@/lib/auth";

import Link from "next/link";

import DesktopMenu from "./desktop-menu/desktop-menu";
import MobileMenu from "./mobile-menu/mobile-menu";

import { siteName } from "@/config";

async function Nav() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="flex justify-center items-center sticky w-full py-3 px-5 border-b bg-background/95 top-0 z-25 supports-[backdrop-filter]:bg-background/60">
      <div className="flex content-wrapper w-full">
        <nav className="flex justify-between items-center w-full">
          <div className="flex items-center gap-12">
            <h1 className="text-2xl font-semibold">
              <Link href="/">{siteName}</Link>
            </h1>
            <ul className="list-none hidden md:flex md:gap-6">
              <li className="text-muted-foreground transition-[color] text-center hover:text-foreground">
                <Link href="">Polls</Link>
              </li>
              <li className="text-muted-foreground transition-[color] text-center hover:text-foreground">
                <Link href="">Reviews</Link>
              </li>
              <li className="text-muted-foreground transition-[color] text-center hover:text-foreground">
                <Link href="">Community</Link>
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
