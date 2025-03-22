import { auth } from "@/auth";

import Nav from "./components/nav/nav";

import MobileMenu from "./components/mobile-menu/mobile-menu";
import DesktopMenu from "./components/desktop-menu/desktop-menu";

async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <header>
        <Nav />
        <DesktopMenu profileIcon={user?.image} />
        <MobileMenu profileIcon={user?.image} />
      </header>
      <main>
        <p>coming soon</p>
        <p>sign in, then see the mobile layout</p>
      </main>
    </>
  );
}

export default Home;
