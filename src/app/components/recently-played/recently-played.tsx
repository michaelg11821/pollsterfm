import { randomUUID } from "crypto";

import { getRecentlyPlayedTracks } from "@/lib/data-access/user/spotify";

import Track from "../track/track";

import styles from "./recently-played.module.css";

type RecentlyPlayedProps = {
  username: string;
  /**
   * Minimum: 1. Default: 20. Maximum: 50.
   */
  limit?: number;
};

async function RecentlyPlayed({ username, limit }: RecentlyPlayedProps) {
  const recentTracks = await getRecentlyPlayedTracks(username, limit);

  if (!recentTracks || !recentTracks.items)
    return <p>Error getting recently played tracks.</p>;

  return (
    <div className={styles.recentTracks}>
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
