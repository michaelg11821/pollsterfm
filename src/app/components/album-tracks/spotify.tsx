"use client";

import { getSpotifyAlbumTracks } from "@/lib/spotify/album";
import { toastManager } from "@/lib/toast";
import type { SpotifyAlbumTracksResponse } from "@/lib/types/spotifyResponses";
import { msToDuration } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import LoadingIndicator from "../ui/loading-indicator";

type SpotifyAlbumTracksProps = {
  artistName: string;
  albumName: string;
  spotifyUrl: string;
};

function SpotifyAlbumTracks({
  artistName,
  albumName,
  spotifyUrl,
}: SpotifyAlbumTracksProps) {
  const [tracks, setTracks] = useState<SpotifyAlbumTracksResponse["items"]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const loadingRef = useRef<boolean>(false);

  const parts = new URL(spotifyUrl).pathname.split("/");
  const spotifyId = parts[parts.length - 1];

  const getTracks = useCallback(
    async (nextUrl?: string) => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);

        const response = nextUrl
          ? await getSpotifyAlbumTracks(spotifyId, nextUrl)
          : await getSpotifyAlbumTracks(spotifyId);

        if (!response || !response.items) {
          throw new Error(
            `Failed to get tracks for ${albumName}. Please refresh the page.`,
          );
        }

        setTracks((prevTracks) => {
          const newTracks = [...prevTracks, ...response.items];

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
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [spotifyId, albumName],
  );

  useEffect(() => {
    getTracks();
  }, [getTracks]);

  const trackItems = useMemo(() => {
    return tracks.map(({ name, track_number, duration_ms }, index) => (
      <Link
        key={`${name}-${index}`}
        className="bg-foreground/5 hover:bg-foreground/10 flex cursor-pointer items-center gap-3 rounded-xl px-2 py-3 transition-[background-color]"
        href={`/catalog/${artistName}/discography/${encodeURIComponent(albumName)}/${encodeURIComponent(name)}`}
      >
        <div className="text-muted-foreground w-8 text-center">
          {track_number}
        </div>
        <div className="min-w-0 flex-1">{name}</div>
        <div className="text-muted-foreground/50 text-sm">
          {msToDuration(duration_ms)}
        </div>
      </Link>
    ));
  }, [albumName, artistName, tracks]);

  return (
    <>
      <div className="space-y-2">{trackItems}</div>
      <LoadingIndicator loading={loading} message="Loading more tracks..." />
      {nextUrl && !loading ? (
        <div className="flex justify-center">
          <Button className="cursor-pointer" onClick={() => getTracks(nextUrl)}>
            Show More Tracks
          </Button>
        </div>
      ) : null}
    </>
  );
}

export default SpotifyAlbumTracks;
