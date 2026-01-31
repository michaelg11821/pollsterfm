"use client";

import type { PollType } from "@/lib/types/pollster";
import { Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const detailedPollsData = [
  {
    id: "p1",
    title: "Best Radiohead Albums of All Time",
    votes: 1243,
    position: "In Rainbows ranked #1",
    date: "2 weeks ago",
    comments: 87,
  },
  {
    id: "p2",
    title: "Most Influential Alternative Rock Bands",
    votes: 876,
    position: "Radiohead ranked #3",
    date: "1 month ago",
    comments: 42,
  },
  {
    id: "p3",
    title: "Artists That Defined the 2000s",
    votes: 1567,
    position: "Radiohead ranked #5",
    date: "3 months ago",
    comments: 124,
  },
  {
    id: "p4",
    title: "Best Live Performances",
    votes: 932,
    position: "Radiohead at Glastonbury ranked #2",
    date: "2 months ago",
    comments: 76,
  },
];

const simplePollsData = [
  {
    id: "p5",
    title: "Best Album Openers That Really Hook You In From The Start",
    votes: 743,
    date: "4 months ago",
  },
  {
    id: "p6",
    title: "Most Experimental Artists",
    votes: 612,
    date: "5 months ago",
  },
  { id: "p7", title: "Best Music Videos", votes: 891, date: "3 months ago" },
];

type FeaturedInProps = {
  category: PollType;
  itemName: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FeaturedIn({ category, itemName }: FeaturedInProps) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Featured In Polls</h2>
        <Link href="#" className={buttonVariants({ variant: "outline" })}>
          View All
        </Link>
      </div>
      <div className="mb-6 flex flex-col gap-4 md:grid md:grid-cols-2">
        {detailedPollsData.map((poll) => (
          <Link key={poll.id} href="#">
            <Card className="hover:bg-accent cursor-pointer transition-[background-color]">
              <CardHeader>
                <CardTitle className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {poll.title}
                </CardTitle>
                <Badge className="mt-1" variant="default">
                  {poll.position}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="h-5 w-5" />
                    <span>{poll.votes} votes</span>
                  </div>
                  <span className="text-muted-foreground/50 ml-auto">
                    {poll.date}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
        {simplePollsData.map((poll) => (
          <Link key={poll.id} href="#">
            <Card className="hover:bg-accent cursor-pointer transition-[background-color]">
              <CardHeader>
                <CardTitle className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {poll.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground flex items-center text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="h-5 w-5" />
                    <span>{poll.votes} votes</span>
                  </div>
                  <span className="text-muted-foreground/50 ml-auto">
                    {poll.date}
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

export default FeaturedIn;
