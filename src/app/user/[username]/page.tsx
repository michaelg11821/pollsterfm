import { redirect } from "next/navigation";
import { enUS } from "date-fns/locale";

import { auth } from "@/lib/auth";
import { getProfile } from "@/lib/actions";

import { type Metadata } from "next";
import { type Month } from "date-fns";

import Image from "next/image";

import ProfileActionsSvg from "../../../../public/ellipsis.svg";
import CalendarSvg from "../../../../public/calendar.svg";
import RightChevron from "../../../../public/chevron-right.svg";
import EditProfileSvg from "../../../../public/square-pen.svg";

import styles from "./page.module.css";
import { Suspense } from "react";
import NowPlaying from "@/app/components/now-playing/now-playing";
import LastFourTracks from "@/app/components/last-four-tracks/last-four-tracks";
import LastFourTracksSkeleton from "@/app/components/last-four-tracks/skeleton/skeleton";
// import Link from "next/link";

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
  metadata.description = `Check out ${username}'s profile on Pollster.fm!`;

  const profile = await getProfile(username);

  if (!profile) return redirect("/not-found");

  const session = await auth();
  const loggedInUser = session?.user;

  const joinMonth = profile.createdAt.getMonth() as Month;

  const joinDate = `${enUS.localize.month(
    joinMonth
  )} ${profile.createdAt.getFullYear()}`;

  const historyImported = false;

  return (
    <main className={styles.pageContainer}>
      <div className={styles.profileContainer}>
        <div className={styles.headerImage}>
          <Image
            src={
              profile.image ? profile.image : "../../../../public/ellipsis.svg"
            }
            alt=""
            fill
            sizes="100%"
            className={styles.headerImageContent}
          />
        </div>
        <div className={styles.sectionWrapper}>
          <div className={styles.profileInfo}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                <Image
                  src={
                    profile.image
                      ? profile.image
                      : "../../../../public/ellipsis.svg"
                  }
                  alt=""
                  fill
                  sizes="100%"
                  priority
                />
              </div>
            </div>
            <div className={styles.profileDetails}>
              <div className={styles.profileHeader}>
                <div>
                  <h1 className={styles.displayName}>{profile.name}</h1>
                  <p className={styles.username}>@{username}</p>
                </div>
                <div className={styles.actionButtons}>
                  {loggedInUser?.username === username ? (
                    <>
                      <button className={styles.editProfileBtn}>
                        <Image
                          src={EditProfileSvg}
                          width={15}
                          height={15}
                          alt=""
                        />
                        Edit Profile
                      </button>
                      <button className={styles.moreButton}>
                        <Image
                          src={ProfileActionsSvg}
                          width={20}
                          height={20}
                          alt=""
                        />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className={styles.followButton}>Follow</button>
                      <button className={styles.moreButton}>
                        <Image
                          src={ProfileActionsSvg}
                          width={20}
                          height={20}
                          alt=""
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className={styles.aboutMe}>{profile.aboutMe}</p>
              <div className={styles.profileMeta}>
                {profile.createdAt && (
                  <div className={styles.metaItem}>
                    <Image
                      src={CalendarSvg}
                      width={20}
                      height={20}
                      alt=""
                      className={styles.iconSmaller}
                    />
                    <span>Joined {joinDate}</span>
                  </div>
                )}
              </div>
              <div className={styles.stats}>
                <a href="#" className={styles.statLink}>
                  <span className={styles.statNumber}>33</span>
                  <span className={styles.statLabel}>Following</span>
                </a>
                <a href="#" className={styles.statLink}>
                  <span className={styles.statNumber}>33</span>
                  <span className={styles.statLabel}>Followers</span>
                </a>
                <a href="#" className={styles.statLink}>
                  <span className={styles.statNumber}>33</span>
                  <span className={styles.statLabel}>Polls Created</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.recentlyPlayed}>
        <div className={styles.sectionWrapper}>
          <div className={styles.recentlyPlayedHeader}>
            <p className={styles.sectionTitle}>Recently Played</p>
            {historyImported ? (
              <button className={styles.viewHistory}>
                View History{" "}
                <Image src={RightChevron} width={20} height={20} alt="" />
              </button>
            ) : (
              <button className={styles.viewHistory}>
                View More{" "}
                <Image src={RightChevron} width={15} height={15} alt="" />
              </button>
            )}
          </div>
          <div className={styles.tracksContainer}>
            <Suspense fallback={<p>Loading...</p>}>
              <NowPlaying username={username} name={profile.name!} />
            </Suspense>
            <Suspense fallback={<LastFourTracksSkeleton />}>
              <LastFourTracks username={username} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;
