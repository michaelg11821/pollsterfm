import Poll from "@/app/components/poll/poll";
import type { Id } from "@/lib/convex/_generated/dataModel";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type PollPageProps = {
  params: Promise<{ poll: string }>;
};

async function PollPage({ params }: PollPageProps) {
  const { poll } = await params;

  if (!poll) return redirect("/not-found");

  return (
    <main className="content-wrapper px-5 py-8 xl:p-0">
      <Link
        href="/polls"
        className="text-primary hover:text-ring/50 mb-6 inline-flex items-center text-sm no-underline transition-[color]"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to polls
      </Link>
      <Poll id={poll as Id<"polls">} />
    </main>
  );
}

export default PollPage;
