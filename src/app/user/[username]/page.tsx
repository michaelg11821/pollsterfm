import Affinities from "@/app/components/affinities/affinities";
import AffinitiesSkeleton from "@/app/components/affinities/skeleton";
import NowPlaying from "@/app/components/now-playing/now-playing";
import NowPlayingSkeleton from "@/app/components/now-playing/skeleton";
import ProfileHeader from "@/app/components/profile/profile";
import ProfileHeaderSkeleton from "@/app/components/profile/skeleton";
import RecentlyPlayed from "@/app/components/recently-played/recently-played";
import RecentlyPlayedSkeleton from "@/app/components/recently-played/skeleton";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { ChevronRight } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
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
                <Suspense fallback={<RecentlyPlayedSkeleton limit={4} />}>
                  <RecentlyPlayed username={username} limit={4} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="px-0 py-9">
          <div className="content-wrapper px-5 xl:p-0">
            <Suspense fallback={<AffinitiesSkeleton />}>
              <Affinities />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;
