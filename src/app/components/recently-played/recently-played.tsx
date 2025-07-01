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
    api.spotify.user.getRecentlyPlayedTracks,
    { username, limit: limit ?? 20 },
    { token },
  );

  if (!recentTracks || !recentTracks.items)
    return <p>Error getting recently played tracks.</p>;

  return (
    <div className="flex flex-col gap-3">
      {recentTracks.items.map(({ track, played_at }) => (
        <Track
          key={randomUUID()}
          album={track.album}
          trackTitle={track.name}
          playedAt={played_at}
        />
      ))}
    </div>
  );
}

export default RecentlyPlayed;
