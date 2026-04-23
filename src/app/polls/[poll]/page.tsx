import BackLink from "@/app/components/layout/back-link";
import PageShell from "@/app/components/layout/page-shell";
import Poll from "@/app/components/poll/poll";
import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import type { Id } from "@/lib/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
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
    <PageShell>
      <div className="mb-6">
        <BackLink href="/polls" label="Back to polls" />
      </div>
      <Poll id={poll} />
    </PageShell>
  );
}

export default PollPage;
