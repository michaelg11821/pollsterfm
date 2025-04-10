import { randomUUID } from "crypto";

import { spotifyApiWithCredentials } from "@/lib/actions";

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
  const spotify = await spotifyApiWithCredentials(username);

  if (!spotify) return <p>Given user is invalid.</p>;

  let computedLimit: number;

  if (!limit) {
    computedLimit = 20;
  } else if (limit > 50) {
    computedLimit = 50;
  } else {
    computedLimit = limit;
  }

  const recentTracks = await spotify.getRecentlyPlayedTracks(computedLimit);

  if (!recentTracks.items) return <p>Error getting recently played tracks.</p>;

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
