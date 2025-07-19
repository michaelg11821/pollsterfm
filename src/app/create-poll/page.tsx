import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreatePoll from "../components/create-poll/create-poll";

async function CreatePollPage() {
  const token = await convexAuthNextjsToken();
  const user = await fetchQuery(api.user.currentUser, {}, { token });

  if (!user)
    return redirect(
      `/sign-in?redirectTo=${encodeURIComponent("/create-poll")}`,
    );

  return (
    <main className="content-wrapper px-5 py-8 xl:px-0">
      <Link
        href="/polls"
        className="text-primary hover:text-ring/50 mb-4 inline-flex items-center text-sm no-underline transition-[color]"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to polls
      </Link>
      <h2 className="mb-6 text-3xl font-bold">New Poll</h2>
      <CreatePoll />
    </main>
  );
}

export default CreatePollPage;
