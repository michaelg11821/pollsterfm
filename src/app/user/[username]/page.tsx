import PageShell from "@/app/components/layout/page-shell";
import SectionHeader from "@/app/components/layout/section-header";
import NowPlaying from "@/app/components/now-playing/now-playing";
import ProfileHeader from "@/app/components/profile/profile";
import RecentlyPlayed from "@/app/components/recently-played/recently-played";
import TopAffinitiesSkeleton from "@/app/components/top-affinities/skeleton";
import TopAffinities from "@/app/components/top-affinities/top-affinities";
import UserActivitySkeleton from "@/app/components/user-activity/skeleton";
import UserActivity from "@/app/components/user-activity/user-activity";
import UserReviewsSkeleton from "@/app/components/user-reviews/skeleton";
import UserReviews from "@/app/components/user-reviews/user-reviews";
import { SITE_NAME } from "@/lib/constants/site-info";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type ProfileProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({
  params,
}: ProfileProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `${username} | ${SITE_NAME}`,
    description: `Check out ${username}'s profile on ${SITE_NAME}!`,
  };
}

async function Profile({ params }: ProfileProps) {
  const { username } = await params;

  if (!username) return redirect("/not-found");

  return (
    <PageShell variant="split" hero={<ProfileHeader username={username} />}>
      <div className="flex flex-col gap-10">
        <section>
          <SectionHeader
            title="Recently Played"
            action={{
              label: "View More",
              href: `/user/${username}/history`,
            }}
          />
          <NowPlaying username={username} />
          <RecentlyPlayed username={username} limit={4} />
        </section>
        <section>
          <Suspense fallback={<TopAffinitiesSkeleton />}>
            <TopAffinities category="user" itemName={username} />
          </Suspense>
        </section>
        <section>
          <SectionHeader title="Activity" />
          <Suspense fallback={<UserActivitySkeleton limit={5} />}>
            <UserActivity username={username} limit={5} />
          </Suspense>
        </section>
        <section>
          <SectionHeader title="Reviews" />
          <Suspense fallback={<UserReviewsSkeleton limit={5} />}>
            <UserReviews username={username} limit={5} />
          </Suspense>
        </section>
      </div>
    </PageShell>
  );
}

export default Profile;
