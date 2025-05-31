"use client";

import { getRecentlyPlayedTracks } from "@/lib/data-access/user/spotify";
import { toastManager } from "@/lib/toast";
import { SpotifyRecentlyPlayedResponse } from "@/lib/types/spotifyResponses";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Track from "../../track/track";
import { MAX_TRACKS_WITHOUT_IMPORT, TRACK_CHUNK_SIZE } from "./config";

const hasImport = false;

function SpotifyListeningHistory() {
  // show a toast on error
  const [tracks, setTracks] = useState<SpotifyRecentlyPlayedResponse["items"]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
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
        nextUrl || undefined,
      );

      if (!response || !response.items) {
        throw new Error("Failed to load tracks. Please try again.");
      }

      setTracks((prevTracks) => {
        const newTracks = [...prevTracks, ...response.items];

        if (newTracks.length >= MAX_TRACKS_WITHOUT_IMPORT) {
          setHasMore(false);
        }

        return newTracks;
      });

      setNextUrl(response.next);
    } catch (err: unknown) {
      console.error("error getting tracks:", err);

      if (err instanceof Error) {
        toastManager.add({
          title: "Error",
          description: err.message,
        });
      }

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
        album={track.album}
        trackTitle={track.name}
        playedAt={played_at}
      />
    ));
  }, [tracks]);

  return (
    <>
      <div className="content-wrapper flex flex-col gap-1 px-5 py-2.5 xl:p-0">
        {trackItems}
      </div>
      <div className="content-wrapper px-5 xl:p-0">
        <div
          ref={loaderRef}
          className="flex justify-center px-0 py-8"
          data-testid="loader-ref"
        >
          {loading && (
            <div className="text-muted-foreground flex items-center gap-5">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading more tracks...</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SpotifyListeningHistory;
