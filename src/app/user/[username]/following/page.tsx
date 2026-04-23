import Following from "@/app/components/following/following";
import BackLink from "@/app/components/layout/back-link";
import PageShell from "@/app/components/layout/page-shell";
import { SITE_NAME } from "@/lib/constants/site-info";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type FollowingPageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({
  params,
}: FollowingPageProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `${username}'s following | ${SITE_NAME}`,
    description: `Check out who ${username} is following on ${SITE_NAME}!`,
  };
}

async function FollowingPage({ params }: FollowingPageProps) {
  const { username } = await params;

  if (!username) return redirect("/not-found");

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-5">
          <BackLink href={`/user/${username}`} />
          <div>
            <h2 className="text-2xl font-bold">Following</h2>
            <p className="text-muted-foreground text-sm">@{username}</p>
          </div>
        </div>
        <Following username={username} />
      </div>
    </PageShell>
  );
}

export default FollowingPage;
