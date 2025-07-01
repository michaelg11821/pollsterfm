import NowPlaying from "@/app/components/now-playing/now-playing";
import NowPlayingSkeleton from "@/app/components/now-playing/skeleton";
import ProfileHeader from "@/app/components/profile/profile";
// import RecentlyPlayed from "@/app/components/recently-played/recently-played";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { siteName } from "@/config";
import { ChevronRight } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
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
    title: `${username} | ${siteName}`,
    description: `Check out ${username}'s profile on ${siteName}!`,
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
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Recently Played</h2>
              <Link
                className={buttonVariants({ variant: "ghost" })}
                href={`/user/${username}/history`}
              >
                View More <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
            <Card>
              <CardContent>
                <Suspense fallback={<NowPlayingSkeleton />}>
                  <NowPlaying username={username} />
                </Suspense>
                {/* <RecentlyPlayed username={username} limit={4} /> */}
              </CardContent>
            </Card>
          </div>
        </section>
        {/* <section className="px-0 py-9">
          <div className="content-wrapper px-5 xl:p-0">
            <Suspense fallback={<TopAffinitiesSkeleton />}>
              <TopAffinities category="user" itemName={username} />
            </Suspense>
          </div>
        </section> */}
      </div>
    </main>
  );
}

export default Profile;
