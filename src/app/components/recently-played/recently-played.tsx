import { randomUUID } from "crypto";

import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import Track from "../track/track";

type RecentlyPlayedProps = {
  username: string;
  /**
   * Minimum: 1. Default: 20. Maximum: 50.
   */
  limit?: number;
};

async function RecentlyPlayed({ username, limit }: RecentlyPlayedProps) {
  const token = await convexAuthNextjsToken();

  const recentTracks = await fetchAction(
    api.user.getRecentlyPlayedTracks,
    { username, limit: limit ?? 20 },
    { token },
  );

  if (!recentTracks || "error" in recentTracks)
    return <p>Could not retrieve recently played tracks.</p>;

  return (
    <div className="flex flex-col gap-3">
      {recentTracks.map((track) => (
        <Track
          key={randomUUID()}
          name={track.name}
          image={track.image}
          artists={track.artists}
          albumName={track.albumName}
          playedAt={track.playedAt}
        />
      ))}
    </div>
  );
}

export default RecentlyPlayed;
