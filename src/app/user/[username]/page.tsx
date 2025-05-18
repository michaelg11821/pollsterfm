import ProfileHeader from "@/app/components/profile/profile";
import ProfileHeaderSkeleton from "@/app/components/profile/skeleton";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

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

  return (
    <main>
      <div className="pt-2">
        <Suspense fallback={<ProfileHeaderSkeleton />}>
          <ProfileHeader username={username} />
        </Suspense>
        {/* <section className={styles.recentlyPlayed}>
          <div className={styles.sectionWrapper}>
            <div className={styles.recentlyPlayedHeader}>
              <h2 className={styles.sectionTitle}>Recently Played</h2>
              <Link
                className={styles.viewHistory}
                href={`/user/${username}/history`}
              >
                View More{" "}
                <Image src={RightChevron} width={20} height={20} alt="" />
              </Link>
            </div>
            <div className={styles.tracksContainer}>
              <Suspense fallback={<NowPlayingSkeleton />}>
                <NowPlaying username={username} />
              </Suspense>
              <Suspense fallback={<RecentlyPlayedSkeleton limit={4} />}>
                <RecentlyPlayed username={username} limit={4} />
              </Suspense>
            </div>
          </div>
        </section>
        <section className={styles.affinities}>
          <div className={styles.sectionWrapper}>
            <Suspense fallback={<AffinitiesSkeleton />}>
              <Affinities />
            </Suspense>
          </div>
        </section> */}
      </div>
    </main>
  );
}

export default Profile;
