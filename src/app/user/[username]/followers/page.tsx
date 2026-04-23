import Followers from "@/app/components/followers/followers";
import BackLink from "@/app/components/layout/back-link";
import PageShell from "@/app/components/layout/page-shell";
import { SITE_NAME } from "@/lib/constants/site-info";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type FollowersPageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({
  params,
}: FollowersPageProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `${username}'s followers | ${SITE_NAME}`,
    description: `Check out who follows ${username} on ${SITE_NAME}!`,
  };
}

async function FollowersPage({ params }: FollowersPageProps) {
  const { username } = await params;

  if (!username) return redirect("/not-found");

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-5">
          <BackLink href={`/user/${username}`} />
          <div>
            <h2 className="text-2xl font-bold">Followers</h2>
            <p className="text-muted-foreground text-sm">@{username}</p>
          </div>
        </div>
        <Followers username={username} />
      </div>
    </PageShell>
  );
}

export default FollowersPage;
