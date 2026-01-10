import Poll from "@/app/components/poll/poll";
import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import type { Id } from "@/lib/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

type PollPageProps = {
  params: Promise<{ poll: Id<"polls"> }>;
};

export async function generateMetadata({
  params,
}: PollPageProps): Promise<Metadata> {
  const { poll } = await params;

  const pollData = await fetchQuery(api.pollster.poll.getById, { id: poll });

  if (!pollData) redirect("/not-found");

  return {
    title: `${pollData?.question} | ${SITE_NAME}`,
    description: `${pollData?.description ?? "Learn more about this poll on pollster.fm!"}`,
  };
}

async function PollPage({ params }: PollPageProps) {
  const { poll } = await params;

  if (!poll) return redirect("/not-found");

  return (
    <main className="content-wrapper px-5 py-8 xl:px-0">
      <Link
        href="/polls"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center text-sm transition-colors"
      >
        <ChevronLeft className="mr-1.5 h-4 w-4" />
        Back to polls
      </Link>
      <Poll id={poll} />
    </main>
  );
}

export default PollPage;
