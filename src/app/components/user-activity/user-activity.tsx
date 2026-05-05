"use client";

import { getChoiceItemName } from "@/lib/convex-utils";
import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import UserActivitySkeleton from "./skeleton";

type UserActivityProps = {
  username: string;
  limit?: number;
};

function getCatalogHref({
  artist,
  album,
  track,
}: {
  artist: string;
  album: string | null;
  track: string | null;
}) {
  const encodedArtist = encodeURIComponent(artist);

  if (track && album) {
    return `/catalog/${encodedArtist}/discography/${encodeURIComponent(album)}/${encodeURIComponent(track)}`;
  }

  if (album) {
    return `/catalog/${encodedArtist}/discography/${encodeURIComponent(album)}`;
  }

  return `/catalog/${encodedArtist}`;
}

function UserActivity({ username, limit }: UserActivityProps) {
  const resolvedLimit = limit ?? 5;
  const activity = useQuery(api.user.getUserActivity, {
    username,
    limit: resolvedLimit,
  });

  if (activity === undefined) {
    return <UserActivitySkeleton limit={resolvedLimit} />;
  }

  if (activity === null || activity.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No activity yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {activity.map((item) => {
        const choiceName = getChoiceItemName(item) ?? item.artist;
        const catalogHref = getCatalogHref(item);

        return (
          <div key={item._id} className="flex items-center gap-3">
            <Link
              href={catalogHref}
              className="relative size-12 flex-shrink-0 overflow-hidden rounded-md"
            >
              <Image
                src={item.image}
                alt={choiceName}
                fill
                className="object-cover"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">
                <span className="text-muted-foreground">voted for </span>
                <Link
                  href={catalogHref}
                  className="hover:text-primary font-medium transition-colors"
                >
                  {choiceName}
                </Link>
              </p>
              <Link
                href={`/polls/${item.pollId}`}
                className="text-muted-foreground hover:text-foreground block truncate text-xs transition-colors"
              >
                in {item.pollQuestion}
              </Link>
            </div>
            <span className="text-muted-foreground flex-shrink-0 text-xs">
              {formatDistanceToNow(item._creationTime, { addSuffix: true })}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default UserActivity;
