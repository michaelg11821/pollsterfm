import { ChevronLeft } from "lucide-react";

import Link from "next/link";

import Following from "@/app/components/following/following";
import { buttonVariants } from "@/app/components/ui/button";
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
    <main className="content-wrapper px-3.5 py-8 pb-0 lg:px-0">
      <div>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-5">
            <Link
              href={`/user/${username}`}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <ChevronLeft />
              <span className="visually-hidden">Back</span>
            </Link>
            <div>
              <h2 className="text-2xl font-bold">Following</h2>
              <p className="text-muted-foreground text-sm">@{username}</p>
            </div>
          </div>
          <Following username={username} />
        </div>
      </div>
    </main>
  );
}

export default FollowingPage;
