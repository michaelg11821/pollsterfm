"use client";

import { api } from "@/lib/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import LoadingIndicator from "../ui/loading-indicator";

type FollowersProps = {
  username: string;
};

function Followers({ username }: FollowersProps) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.user.getFollowers,
    { username },
    { initialNumItems: 20 },
  );

  if (status === "LoadingFirstPage") {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingIndicator loading={true} />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-muted/50 mb-4 rounded-full p-6">
          <Users className="text-muted-foreground h-12 w-12" />
        </div>
        <h3 className="text-foreground mb-2 text-xl font-semibold">
          No followers yet
        </h3>
        <p className="text-muted-foreground max-w-md text-sm">
          {username} doesn&apos;t have any followers yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((follower) => (
          <Link
            key={follower.username}
            href={`/user/${follower.username}`}
            className="border-border hover:bg-accent/50 group flex items-center gap-4 rounded-lg border p-4 transition-colors"
          >
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full">
              {follower.image ? (
                <Image
                  src={follower.image}
                  alt={follower.name || follower.username}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <div className="bg-muted flex h-full w-full items-center justify-center">
                  <Users className="text-muted-foreground h-6 w-6" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate font-semibold">
                {follower.name || follower.username}
              </p>
              <p className="text-muted-foreground truncate text-sm">
                @{follower.username}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {status === "CanLoadMore" && (
        <div className="flex justify-center">
          <Button
            onClick={() => loadMore(20)}
            variant="outline"
            className="min-w-32"
          >
            Load More
          </Button>
        </div>
      )}

      {status === "LoadingMore" && (
        <div className="flex justify-center py-4">
          <LoadingIndicator loading={true} />
        </div>
      )}
    </div>
  );
}

export default Followers;
