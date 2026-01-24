"use client";

import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import { AlertCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import PollPreview from "../poll-preview/poll-preview";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import LoadingIndicator from "../ui/loading-indicator";
import UserPollsHeader from "./header";

type UserPollsProps = {
  username: string;
};

function UserPolls({ username }: UserPollsProps) {
  const currentUser = useQuery(api.user.currentUser);
  const userPolls = useQuery(api.pollster.poll.getUserPolls, { username });

  const isOwnProfile = currentUser?.username === username;

  return (
    <>
      <UserPollsHeader
        username={username}
        isOwnProfile={isOwnProfile}
        userPolls={userPolls}
      />
      {userPolls === undefined ? (
        <div className="space-y-4">
          <LoadingIndicator loading={true} />
        </div>
      ) : userPolls === null || userPolls.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-xl font-semibold">No polls yet</h3>
            <p className="text-muted-foreground mb-6 text-center">
              {isOwnProfile
                ? `Create your first poll to start engaging with the ${SITE_NAME} community`
                : `${username} hasn't created any polls yet`}
            </p>
            {isOwnProfile && (
              <Link href="/create-poll">
                <Button>
                  <PlusCircle className="h-4 w-4" />
                  Create your first poll
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          {userPolls.map((poll) => (
            <PollPreview key={poll._id} poll={poll} />
          ))}
        </div>
      )}
    </>
  );
}

export default UserPolls;
