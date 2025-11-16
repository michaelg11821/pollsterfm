"use client";

import { api } from "@/lib/convex/_generated/api";
import { toastManager } from "@/lib/toast";
import { SpotifyRecentlyPlayedResponse } from "@/lib/types/spotifyResponses";
import { useAction } from "convex/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Track from "../../track/track";
import LoadingIndicator from "../../ui/loading-indicator";
import {
  MAX_TRACKS_WITHOUT_IMPORT,
  TRACK_CHUNK_SIZE,
  trackFetchingError,
} from "./config";

import * as Sentry from "@sentry/nextjs";

type SpotifyListeningHistoryProps = {
  historyImported: boolean;
  username: string;
};

function SpotifyListeningHistory({
  historyImported = false,
  username,
}: SpotifyListeningHistoryProps) {
  const [tracks, setTracks] = useState<SpotifyRecentlyPlayedResponse["items"]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loaderRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<boolean>(false);
  const hasMoreRef = useRef<boolean>(true);

  const getRecentlyPlayedTracks = useAction(
    api.spotify.user.getRecentlyPlayedTracks,
  );

  const getTracks = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);

      const response = await getRecentlyPlayedTracks({
        username,
        limit: TRACK_CHUNK_SIZE,
        next: nextUrl || undefined,
      });

      if ("error" in response) {
        throw new Error(trackFetchingError);
      }

      if (!response || !response.items) {
        throw new Error(trackFetchingError);
      }

      setTracks((prevTracks) => {
        const newTracks = [...prevTracks, ...response.items];

        if (newTracks.length >= MAX_TRACKS_WITHOUT_IMPORT && !historyImported) {
          hasMoreRef.current = false;
          setHasMore(false);
        }

        return newTracks;
      });

      setNextUrl(response.next);
    } catch (err: unknown) {
      Sentry.captureException(err);

      toastManager.add({
        title: "Error",
        description: trackFetchingError,
      });

      hasMoreRef.current = false;
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [getRecentlyPlayedTracks, username, nextUrl, historyImported]);

  useEffect(() => {
    getTracks();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current) {
          getTracks();
        }
      },
      { threshold: 1.0 },
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
        name={track.name}
        image={track.album.images[1].url}
        artists={track.artists.map(({ name }) => name)}
        albumName={track.album.name}
      />
    ));
  }, [tracks]);

  return (
    <>
      <div className="flex flex-col gap-1.5 py-2.5">{trackItems}</div>
      <LoadingIndicator
        ref={loaderRef}
        loading={loading}
        message="Loading more tracks..."
      />
    </>
  );
}

export default SpotifyListeningHistory;
