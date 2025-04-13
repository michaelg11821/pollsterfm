"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { ArrowLeft, Info, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

import { getRecentlyPlayedTracks } from "@/lib/actions";

import Link from "next/link";

import Track from "@/app/components/track/track";

import type { SpotifyRecentlyPlayedResponse } from "@/lib/types/externalResponses";

import styles from "./page.module.css";

const TRACK_CHUNK_SIZE = 25;
const MAX_TRACKS_WITHOUT_IMPORT = 50;
const hasImport = false;

function History() {
  const [tracks, setTracks] = useState<SpotifyRecentlyPlayedResponse["items"]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { username } = useParams<{ username: string }>();
  const loaderRef = useRef<HTMLDivElement>(null);

  const getTracks = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const response = await getRecentlyPlayedTracks(
        username,
        TRACK_CHUNK_SIZE,
        nextUrl || undefined
      );

      if (!response || !response.items) {
        throw new Error("malformed track data");
      }

      setTracks((prevTracks) => {
        const newTracks = [...prevTracks, ...response.items];

        if (newTracks.length >= MAX_TRACKS_WITHOUT_IMPORT) {
          setHasMore(false);
        }

        return newTracks;
      });

      setNextUrl(response.next);
    } catch (err) {
      console.error("error getting tracks:", err);

      setError("Failed to load tracks. Please try again.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [username, loading, hasMore, nextUrl]);

  useEffect(() => {
    getTracks();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          getTracks();
        }
      },
      { threshold: 1.0 }
    );

    const currentLoader = loaderRef.current;

    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [getTracks, hasMore]);

  const trackItems = useMemo(() => {
    return tracks?.map(({ track, played_at }) => (
      <Track
        key={`${track.id}-${played_at}`}
        album={track.album}
        trackTitle={track.name}
        playedAt={played_at}
      />
    ));
  }, [tracks]);

  return (
    <main className={styles.pageContainer}>
      <div className={styles.sectionWrapper}>
        <div className={styles.profileHeader}>
          <div className={styles.profileHeaderTop}>
            <button className={styles.backButton}>
              <Link href={`/user/${username}`}>
                <ArrowLeft className={styles.backIcon} />
                <span className={styles.visuallyHidden}>Back</span>
              </Link>
            </button>
            <div>
              <h2 className={styles.title}>Listening History</h2>
              <p className={styles.username}>@{username}</p>
            </div>
          </div>
          {!hasImport && (
            <div className={styles.alert}>
              <Info className={styles.alertIcon} />
              <span className={styles.alertText}>
                Only showing {MAX_TRACKS_WITHOUT_IMPORT} recent tracks. Import
                your Spotify or Apple Music streaming history to see more!
              </span>
            </div>
          )}
        </div>
      </div>
      <div className={`${styles.sectionWrapper} ${styles.trackList}`}>
        {trackItems}
      </div>
      <div className={styles.sectionWrapper}>
        <div ref={loaderRef} className={styles.loaderContainer}>
          {loading && (
            <div className={styles.loadingWrapper}>
              <Loader2 className={styles.loaderIcon} />
              <span>Loading more tracks...</span>
            </div>
          )}
          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>
    </main>
  );
}

export default History;
