import { Doc } from "@/lib/convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";
import { Users } from "lucide-react";
import Link from "next/link";
import EmptyState from "../layout/empty-state";
import ItemGrid from "../layout/item-grid";
import SectionHeader from "../layout/section-header";
import LoadingIndicator from "../ui/loading-indicator";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type FeaturedInBaseProps = {
  featuredPolls: Doc<"polls">[] | undefined;
  featuredType: "artist" | "album" | "track";
};

function FeaturedInBase({ featuredPolls, featuredType }: FeaturedInBaseProps) {
  if (featuredPolls === undefined)
    return <LoadingIndicator loading={true} message="Loading..." />;

  if (featuredPolls === null || featuredPolls.length === 0) {
    return (
      <section>
        <SectionHeader title="Featured In Polls" />
        <EmptyState
          message={`This ${featuredType} is not featured in any polls yet.`}
        />
      </section>
    );
  }

  return (
    <section>
      <SectionHeader
        title="Featured In Polls"
        action={{ label: "View All", href: "/polls" }}
      />
      <ItemGrid>
        {featuredPolls.map((poll) => (
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
      </ItemGrid>
    </section>
  );
}

export default FeaturedInBase;
