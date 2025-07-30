import Image from "next/image";

import Link from "next/link";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const topListenersData = [
  { username: "musicphilosopher", plays: 142, image: null, match: 96 },
  {
    username: "ambientwaves",
    plays: 118,
    image: null,
    match: 92,
  },
  {
    username: "melancholymuse",
    plays: 103,
    image: null,
    match: 89,
  },
  {
    username: "soundexplorer",
    plays: 87,
    image: null,
    match: 85,
  },
  { username: "vinylcollector", plays: 76, image: null, match: 82 },
  {
    username: "indieheaven",
    plays: 64,
    image: null,
    match: 79,
  },
];

type TopListenersProps = {
  category: "artist" | "album" | "track";
  itemName: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function TopListeners({ category, itemName }: TopListenersProps) {
  // use spotify / last fm / other platform to gauge this stat

  // prefer spotify
  // use available platform otherwise

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Top Listeners</h2>
        <Link href="#" className={buttonVariants({ variant: "outline" })}>
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topListenersData.map((user, i) => (
          <Link key={i} href="#">
            <Card className="hover:bg-accent cursor-pointer py-4 transition-[background-color]">
              <CardContent className="flex flex-row gap-3">
                <div className="bg-background/20 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.username}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p>@{user.username}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="default">{user.match}% match</Badge>
                    <span className="text-muted-foreground text-xs">
                      {user.plays} plays
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default TopListeners;
