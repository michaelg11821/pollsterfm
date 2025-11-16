import { ChevronLeft } from "lucide-react";

import Link from "next/link";

import ListeningHistory from "@/app/components/listening-history/listening-history";
import { buttonVariants } from "@/app/components/ui/button";
import { SITE_NAME } from "@/lib/constants/site-info";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type HistoryProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
}: HistoryProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `${username}'s listening history | ${SITE_NAME}`,
    description: `Check out ${username}'s listening history on ${SITE_NAME}!`,
  };
}

async function History({ params, searchParams }: HistoryProps) {
  const { username } = await params;
  const { page } = await searchParams;

  if (!username) return redirect("/not-found");

  return (
    <main className="content-wrapper px-3.5 py-8 pb-0 lg:px-0">
      <div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-5">
            <Link
              href={`/user/${username}`}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <ChevronLeft />
              <span className="visually-hidden">Back</span>
            </Link>
            <div>
              <h2 className="text-2xl font-bold">Listening History</h2>
              <p className="text-muted-foreground text-sm">@{username}</p>
            </div>
          </div>
        </div>
      </div>
      <ListeningHistory username={username} page={Number(page) ?? 1} />
    </main>
  );
}

export default History;
