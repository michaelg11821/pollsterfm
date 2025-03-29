import { Metadata } from "next";

import { auth } from "@/lib/auth";

import Image from "next/image";

import { type PollsterUser } from "@/lib/types/pollsterUser";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "(username) | Pollster.fm",
  description: "Check out (username)'s profile on Pollster.fm!",
};

async function Profile() {
  const session = await auth();
  const user = session?.user as PollsterUser;

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
                  {user.pronouns && (
                    <p className={styles.pronouns}>{user.pronouns}</p>
                  )}
                </div>
                <p className={styles.username}>@{user.username}</p>
              </div>
            </div>
            {user.aboutMe && <p className={styles.aboutMe}>{user.aboutMe}</p>}
            <div className={styles.userStats}>
              <div className="pollsCreated">
                <p className={styles.userStatTitle}>Polls created</p>
                <p>300.3M</p>
              </div>
              <div className="votesGiven">
                <p className={styles.userStatTitle}>Votes given</p>
                <p>300.3M</p>
              </div>
              <div className="friends">
                <p className={styles.userStatTitle}>Friends</p>
                <p>300.3M</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Profile;
