import { Doc } from "@/lib/convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";
import { Users } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import LoadingIndicator from "../ui/loading-indicator";

type FeaturedInBaseProps = {
  featuredPolls: Doc<"polls">[] | undefined;
};

function FeaturedInBase({ featuredPolls }: FeaturedInBaseProps) {
  if (featuredPolls === undefined)
    return <LoadingIndicator loading={true} message="Loading..." />;

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Featured In Polls</h2>
        <Link href="#" className={buttonVariants({ variant: "outline" })}>
          View All
        </Link>
      </div>
      <div className="mb-6 flex flex-col gap-4 md:grid md:grid-cols-2">
        {featuredPolls.slice(0, 4).map((poll) => (
          <Link key={poll._id} href={`/polls/${poll._id}`}>
            <Card className="hover:bg-accent cursor-pointer transition-[background-color]">
              <CardHeader>
                <CardTitle className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {poll.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="h-5 w-5" />
                    <span>{poll.totalVotes} votes</span>
                  </div>
                  <span className="text-muted-foreground/50 ml-auto">
                    {formatDistanceToNow(poll._creationTime, {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
        {featuredPolls.slice(4).map((poll) => (
          <Link key={poll._id} href={`/polls/${poll._id}`}>
            <Card className="hover:bg-accent cursor-pointer transition-[background-color]">
              <CardHeader>
                <CardTitle className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {poll.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground flex items-center text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="h-5 w-5" />
                    <span>{poll.totalVotes} votes</span>
                  </div>
                  <span className="text-muted-foreground/50 ml-auto">
                    {formatDistanceToNow(poll._creationTime, {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default FeaturedInBase;
