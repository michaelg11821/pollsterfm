import { auth } from "@/auth";

import ProfileIcon from "./components/profile-icon";

import styles from "./page.module.css";

async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <ProfileIcon user={user} />
      <p>baby britain</p>
    </>
  );
}

export default Home;
