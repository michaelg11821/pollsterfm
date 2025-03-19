import { auth } from "@/auth";

import Nav from "./components/nav/nav";

import styles from "./page.module.css";

async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <header className={styles.homeHeader}>
        <Nav profileIcon={user?.image} />
      </header>
      <main>
        <p>coming soon</p>
        <p>see the mobile layout</p>
      </main>
    </>
  );
}

export default Home;
