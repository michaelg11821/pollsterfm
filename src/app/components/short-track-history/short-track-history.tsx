// import SpotifyApi from "@/lib/spotify";

import { getSpotifyApiCredentials } from "@/lib/actions";

/// import Image from "next/image";
// import Link from "next/link";

// import styles from "./short-track-history.module.css";

interface ShortTrackHistoryProps {
  username: string;
}

async function ShortTrackHistory({ username }: ShortTrackHistoryProps) {
  const credentials = await getSpotifyApiCredentials(username);

  if (!credentials) return <p>Invalid credentials.</p>;

  // const { refresh_token, expires_at, access_token, providerAccountId } =
  // credentials;

  /* const spotify = SpotifyApi(
    access_token,
    refresh_token,
    expires_at,
    providerAccountId
  ); */

  return (
    <>
      {/*<div className={styles.recentTracks}>
              {recentlyPlayed.map((track, i) => (
                <div key={i} className={styles.trackItem}>
                  <div className={styles.recentTrackImageContainer}>
                    <img
                      src={track.image || "/placeholder.svg"}
                      alt={track.title}
                      className={styles.recentTrackImage}
                    />
                    <div className={styles.playOverlay}>
                      <span className={styles.playIcon}>▶</span>
                    </div>
                  </div>

                  <div className={styles.recentTrackInfo}>
                    <h4 className={styles.recentTrackTitle}>{track.title}</h4>
                    <p className={styles.recentTrackDetails}>
                      {track.artist} • {track.album}
                    </p>
                  </div>

                  <div className={styles.trackTime}>{track.time}</div>
                </div>
              ))}
            </div> 
        */}
    </>
  );
}

export default ShortTrackHistory;
