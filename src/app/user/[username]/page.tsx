import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getProfile } from "@/lib/actions";

import Image from "next/image";

import { type PollsterUser } from "@/lib/types/pollsterUser";

import styles from "./page.module.css";

type ProfileProps = {
  params: Promise<{ username: string }>;
};

export const metadata: Metadata = {
  title: "(username) | Pollster.fm",
  description: "Check out (username)'s profile on Pollster.fm!",
};

async function Profile({ params }: ProfileProps) {
  const { username } = await params;

  if (!username) return redirect("/not-found");

  metadata.title = `${username} | Pollster.fm`;

  const profile = await getProfile(username);

  if (!profile) return redirect("/not-found");

  const session = await auth();
  const loggedInUser = session?.user as PollsterUser;

  return (
    <main className={styles.profilePage}>
      <div className={styles.profilePageWrapper}>
        {profile && (
          <div className={styles.profileHeader}>
            <div className={styles.userInfo}>
              {profile.image && (
                <div className={styles.profileIcon}>
                  <Image
                    src={profile.image}
                    alt="Profile Icon"
                    fill
                    sizes="100%"
                  />
                </div>
              )}
              <div className={styles.displayAndUser}>
                <div className={styles.displayAndPronouns}>
                  {profile.name && (
                    <p className={styles.displayName}>{profile.name}</p>
                  )}
                  {profile.pronouns && (
                    <p className={styles.pronouns}>{profile.pronouns}</p>
                  )}
                </div>
                <p className={styles.username}>@{username}</p>
              </div>
            </div>
            {loggedInUser.username === username && <p>edit profile</p>}
            {profile.aboutMe && (
              <p className={styles.aboutMe}>{profile.aboutMe}</p>
            )}
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
