import SectionHeader from "@/app/components/layout/section-header";
import NowPlaying from "@/app/components/now-playing/now-playing";
import ProfileHeader from "@/app/components/profile/profile";
import RecentlyPlayed from "@/app/components/recently-played/recently-played";
import TopAffinitiesSkeleton from "@/app/components/top-affinities/skeleton";
import TopAffinities from "@/app/components/top-affinities/top-affinities";
import { Card, CardContent } from "@/app/components/ui/card";
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
    <main>
      <div className="pt-2">
        <ProfileHeader username={username} />
        <section className="py-6">
          <div className="content-wrapper px-5 xl:p-0">
            <SectionHeader
              variant="sidebar"
              title="Recently Played"
              action={{
                label: "View More",
                href: `/user/${username}/history`,
                variant: "ghost",
              }}
              className="mb-5"
            />
            <Card>
              <CardContent>
                <NowPlaying username={username} />
                <RecentlyPlayed username={username} limit={4} />
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="px-0 py-9">
          <div className="content-wrapper px-5 xl:p-0">
            <Suspense fallback={<TopAffinitiesSkeleton />}>
              <TopAffinities category="user" itemName={username} />
            </Suspense>
          </div>
        </section>
        <section className="px-0 py-9">
          <div className="content-wrapper px-5 xl:p-0">
            <SectionHeader
              variant="sidebar"
              title="Activity"
              className="mb-5"
            />
            <Card>
              <CardContent>
                <Suspense fallback={<UserActivitySkeleton limit={5} />}>
                  <UserActivity username={username} limit={5} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="px-0 py-9">
          <div className="content-wrapper px-5 xl:p-0">
            <SectionHeader
              variant="sidebar"
              title="Reviews"
              className="mb-5"
            />
            <Suspense fallback={<UserReviewsSkeleton limit={5} />}>
              <UserReviews username={username} limit={5} />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;
