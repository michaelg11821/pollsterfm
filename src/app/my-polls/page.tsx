"use client";

import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import { AlertCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import PollPreview from "../components/poll-preview/poll-preview";
import PollPreviewSkeleton from "../components/poll-preview/skeleton";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

function MyPollsPage() {
  const currentUser = useQuery(api.user.currentUser);
  const myPolls = useQuery(api.pollster.poll.getMyPolls);

  if (currentUser === undefined || myPolls === undefined) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 space-y-3">
          <div className="bg-muted h-10 w-64 animate-pulse rounded-lg" />
          <div className="bg-muted h-6 w-96 animate-pulse rounded-lg" />
        </div>
        <div className="space-y-4">
          <PollPreviewSkeleton />
          <PollPreviewSkeleton />
          <PollPreviewSkeleton />
        </div>
      </div>
    );
  }

  if (currentUser === null) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">My polls</h1>
          <p className="text-muted-foreground text-lg">
            {myPolls && myPolls.length > 0
              ? `You've created ${myPolls.length} ${myPolls.length === 1 ? "poll" : "polls"}`
              : "You haven't created any polls yet"}
          </p>
        </div>
        <Link href="/create-poll">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Poll
          </Button>
        </Link>
      </div>

      {myPolls === null || myPolls.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-xl font-semibold">No polls yet</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Create your first poll to start engaging with the {SITE_NAME}{" "}
              community
            </p>
            <Link href="/create-poll">
              <Button>
                <PlusCircle className="h-4 w-4" />
                Create your first poll
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {myPolls.map((poll) => (
            <PollPreview key={poll._id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPollsPage;
