import PageShell from "@/app/components/layout/page-shell";
import UserPolls from "@/app/components/user-polls/user-polls";
import { SITE_NAME } from "@/lib/constants/site-info";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type UserPollsPageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({
  params,
}: UserPollsPageProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `${username}'s polls | ${SITE_NAME}`,
    description: `Check out ${username}'s polls on ${SITE_NAME}!`,
  };
}

async function UserPollsPage({ params }: UserPollsPageProps) {
  const { username } = await params;

  if (!username) {
    redirect("/not-found");
  }

  return (
    <PageShell>
      <UserPolls username={username} />
    </PageShell>
  );
}

export default UserPollsPage;
