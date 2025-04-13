import { randomUUID } from "crypto";

import { spotifyApiWithCredentials } from "@/lib/actions";

import Image from "next/image";

import Reactions from "./reactions/reactions";

import styles from "./now-playing.module.css";

interface NowPlayingProps {
  username: string;
  name: string;
}

async function NowPlaying({ username, name }: NowPlayingProps) {
  const spotify = await spotifyApiWithCredentials(username);

  if (!spotify) return <p>Invalid user.</p>;

  const currentlyPlaying = await spotify.getCurrentlyPlayingTrack();

  if (!currentlyPlaying || !currentlyPlaying.item) return null;

  if (currentlyPlaying.item.is_local) return null;

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
        <div className={styles.nowPlayingBadgeWrapper}>
          <div className={styles.nowPlayingBadge}>Now Playing</div>
        </div>
        <h3 className={styles.trackTitle}>{currentlyPlaying.item.name}</h3>
        <p className={styles.trackDetails}>
          {currentlyPlaying.item.album.artists.map(({ name }, index) => {
            if (index !== currentlyPlaying.item!.album.artists.length - 1) {
              return <span key={randomUUID()}>{name}, </span>;
            }

            return <span key={randomUUID()}>{name}</span>;
          })}{" "}
          <span> • {currentlyPlaying.item.album.name}</span>
        </p>
      </div>
      <Reactions username={username} name={name} />
    </div>
  );
}

export default NowPlaying;
