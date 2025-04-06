import { randomUUID } from "crypto";

import SpotifyApi from "@/lib/spotify";

import { getSpotifyApiCredentials } from "@/lib/actions";

import Image from "next/image";

import styles from "./now-playing.module.css";
import NowPlayingProgress from "./progress/progress";

interface NowPlayingProps {
  username: string;
}

async function NowPlaying({ username }: NowPlayingProps) {
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

  const currentlyPlaying = await spotify.getCurrentlyPlayingTrack();

  if (!currentlyPlaying.item || currentlyPlaying.item.is_local) return;

  return (
    <div className={styles.nowPlaying}>
      <div className={styles.trackImageContainer}>
        <Image
          src={currentlyPlaying.item.album.images[0].url}
          alt=""
          fill
          sizes="100%"
          priority
        />
      </div>
      <div className={styles.trackInfo}>
        <div className={styles.nowPlayingBadge}>Now Playing</div>
        <h3 className={styles.trackTitle}>{currentlyPlaying.item.name}</h3>
        <p className={styles.trackDetails}>
          {currentlyPlaying.item.album.artists.map(({ name }, index) => {
            if (index !== currentlyPlaying.item!.album.artists.length - 1) {
              return <span key={randomUUID()}>{name}, </span>;
            }

            return <span key={randomUUID()}>{name}</span>;
          })}{" "}
          • {currentlyPlaying.item.album.name}
        </p>
      </div>

      <NowPlayingProgress
        progressMs={currentlyPlaying.progress_ms!}
        durationMs={currentlyPlaying.item.duration_ms}
      />
    </div>
  );
}

export default NowPlaying;
