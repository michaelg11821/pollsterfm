import { randomUUID } from "crypto";

import SpotifyApi from "@/lib/spotify";

import { getSpotifyApiCredentials } from "@/lib/actions";
import { dateStringDistanceToNow } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";

import styles from "./last-four-tracks.module.css";

interface LastFourTracksProps {
  username: string;
}

async function LastFourTracks({ username }: LastFourTracksProps) {
  const credentials = await getSpotifyApiCredentials(username);

  if (!credentials) return <p>Invalid credentials.</p>;

  const { refresh_token, expires_at, access_token, providerAccountId } =
    credentials;

  const spotify = SpotifyApi(
    access_token,
    refresh_token,
    expires_at,
    providerAccountId
  );

  const lastFourTracks = await spotify.getLastFourTracks();

  if (!lastFourTracks.items) return;

  return (
    <div className={styles.recentTracks}>
      {lastFourTracks.items.map(({ track, played_at }) => (
        <div key={randomUUID()} className={styles.trackItem}>
          <div className={styles.recentTrackImageContainer}>
            <Image
              src={track.album.images[0].url}
              alt=""
              fill
              sizes="100%"
              priority
            />
          </div>

          <Link className={styles.recentTrackInfo} href="#">
            <p className={styles.recentTrackTitle}>{track.name}</p>
            {track.album.artists.map(({ name }, index) => {
              if (index !== track.album.artists.length - 1) {
                return <span key={randomUUID()}>{name}, </span>;
              }

              return <span key={randomUUID()}>{name}</span>;
            })}{" "}
            • <span>{track.album.name}</span>
          </Link>

          <div className={styles.trackTime}>
            {dateStringDistanceToNow(played_at)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default LastFourTracks;
