import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getProfile } from "@/lib/actions";

import Image from "next/image";

import ProfileActionsSvg from "../../../../public/ellipsis.svg";

import styles from "./page.module.css";
import Link from "next/link";

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
  const loggedInUser = session?.user;

  return (
    <>
      <main className={styles.profilePage}>
        <div className={styles.profilePageWrapper}>
          {profile && (
            <>
              <div className={styles.profileHeader}>
                <div className={styles.userInfoWrapper}>
                  <div className={styles.userInfo}>
                    {profile.image && (
                      <div className={styles.profileIcon}>
                        <Image
                          src={profile.image}
                          alt="Profile Icon"
                          fill
                          sizes="100%"
                          priority
                        />
                      </div>
                    )}
                    <div className={styles.displayAndUser}>
                      <div className={styles.displayAndPronouns}>
                        {profile.name && (
                          <h2 className={styles.displayName}>{profile.name}</h2>
                        )}
                        {profile.pronouns && (
                          <p className={styles.pronouns}>{profile.pronouns}</p>
                        )}
                      </div>
                      <p className={styles.username}>@{username}</p>
                    </div>
                  </div>
                  {loggedInUser?.username === username && (
                    <div className={styles.desktopProfileActionsWrapper}>
                      <div className={styles.profileActions}>
                        <Link
                          href="/settings/profile"
                          className={styles.editProfile}
                        >
                          Edit profile
                        </Link>
                        <button
                          type="button"
                          className={styles.profileActionsToggle}
                        >
                          <Image
                            src={ProfileActionsSvg}
                            width={20}
                            height={20}
                            alt=""
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {profile.aboutMe && (
                  <p className={styles.aboutMe}>{profile.aboutMe}</p>
                )}
                {loggedInUser?.username === username && (
                  <div className={styles.mobileProfileActionsWrapper}>
                    <div className={styles.profileActions}>
                      <Link
                        href="/settings/profile"
                        className={styles.editProfile}
                      >
                        Edit profile
                      </Link>
                      <button
                        type="button"
                        className={styles.profileActionsToggle}
                      >
                        <Image
                          src={ProfileActionsSvg}
                          width={20}
                          height={20}
                          alt=""
                        />
                      </button>
                    </div>
                  </div>
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
              <p className={styles.sectionTitle}>Recent Listens</p>
              <section className="recentTracks"></section>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default Profile;
