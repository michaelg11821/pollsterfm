import { Metadata } from "next";

import { auth } from "@/lib/auth";

import Image from "next/image";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "(username) | Pollster.fm",
  description: "Check out (username)'s profile on Pollster.fm!",
};

async function Profile() {
  const session = await auth();
  const user = session?.user;

  return (
    <main className={styles.profilePage}>
      <div className={styles.profilePageWrapper}>
        {user && (
          <div className={styles.profileHeader}>
            <div className={styles.userInfo}>
              {user.image && (
                <div className={styles.profileIcon}>
                  <Image
                    src={user.image}
                    alt="Profile Icon"
                    fill
                    sizes="100%"
                  />
                </div>
              )}
              <div className={styles.displayAndUser}>
                <div className={styles.displayAndPronouns}>
                  {user.name && (
                    <p className={styles.displayName}>{user.name}</p>
                  )}
                  <p className={styles.pronouns}>none (PLACEHOLDER)</p>
                </div>
                <p className={styles.username}>@PLACEHOLDER</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );

  return <p>{user?.name}</p>;
}

export default Profile;
