import { Doc } from "@/lib/convex/_generated/dataModel";
import { ChevronLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";

type UserPollsHeaderProps = {
  username: string;
  isOwnProfile: boolean;
  userPolls: Doc<"polls">[] | undefined | null;
};

function UserPollsHeader({
  username,
  isOwnProfile,
  userPolls,
}: UserPollsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-5">
        <Link
          href={`/user/${username}`}
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <ChevronLeft />
          <span className="visually-hidden">Back</span>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{`${username}'s Polls`}</h1>
          <p className="text-muted-foreground text-sm">@{username}</p>
        </div>
        {isOwnProfile && (
          <Link href="/create-poll">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Poll
            </Button>
          </Link>
        )}
      </div>
      <p className="text-muted-foreground">
        {userPolls === undefined
          ? ""
          : userPolls === null || userPolls.length === 0
            ? `${isOwnProfile ? "You haven't" : `${username} hasn't`} created any polls yet`
            : `${userPolls.length} ${userPolls.length === 1 ? "poll" : "polls"} created`}
      </p>
    </div>
  );
}

export default UserPollsHeader;
