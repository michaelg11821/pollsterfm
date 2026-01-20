"use client";

import { msToDuration } from "@/lib/convex-utils";
import { api } from "@/lib/convex/_generated/api";
import { ALBUM_PAGE_TRACK_LIMIT } from "@/lib/convex/pollster/config";
import { toastManager } from "@/lib/toast";
import type { LastfmAlbumInfoResponse } from "@/lib/types/lastfmResponses";
import { useAction } from "convex/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import LoadingIndicator from "../ui/loading-indicator";

import * as Sentry from "@sentry/nextjs";

type LastfmAlbumTracksProps = {
  artistName: string;
  albumName: string;
};

function LastfmAlbumTracks({ artistName, albumName }: LastfmAlbumTracksProps) {
  const [tracks, setTracks] = useState<
    LastfmAlbumInfoResponse["album"]["tracks"]["track"]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState(ALBUM_PAGE_TRACK_LIMIT);

  const loadingRef = useRef<boolean>(false);

  const getLastfmAlbumTracks = useAction(api.lastfm.album.getTracks);

  const getTracks = useCallback(async () => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);

      const response = await getLastfmAlbumTracks({ artistName, albumName });

      if (!response || !response.track) {
        throw new Error("bad album tracks response");
      }

      setTracks((prevTracks) => {
        const newTracks = Array.isArray(response.track)
          ? [...prevTracks, ...response.track]
          : [...prevTracks, response.track];

        return newTracks;
      });
    } catch (err: unknown) {
      Sentry.captureException(err);

      toastManager.add({
        title: "Error",
        description: `Failed to get tracks for ${albumName}. Please refresh the page.`,
      });
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [artistName, albumName, getLastfmAlbumTracks]);

  useEffect(() => {
    getTracks();
  }, [getTracks]);

  const trackItems = useMemo(() => {
    return tracks.slice(0, visibleCount).map((track, index) => (
      <Link
        key={`${track.name}-${index}`}
        className="bg-foreground/5 hover:bg-foreground/10 flex cursor-pointer items-center gap-3 rounded-xl px-2 py-3 transition-[background-color]"
        href={`/catalog/${encodeURIComponent(artistName)}/discography/${encodeURIComponent(albumName)}/${encodeURIComponent(track.name)}`}
      >
        <div className="text-muted-foreground w-8 text-center">
          {track["@attr"].rank}
        </div>
        <div className="min-w-0 flex-1">{track.name}</div>
        <div className="text-muted-foreground/50 text-sm">
          {msToDuration(track.duration * 1000)}
        </div>
      </Link>
    ));
  }, [albumName, artistName, tracks, visibleCount]);

  const showMoreButton = tracks.length > visibleCount;

  return (
    <>
      <div className="space-y-2">{trackItems}</div>
      {showMoreButton && (
        <div className="mt-4 flex justify-center">
          <Button
            className="cursor-pointer"
            onClick={() => setVisibleCount(tracks.length)}
          >
            Show All Tracks
          </Button>
        </div>
      )}
      <LoadingIndicator loading={loading} message="Loading more tracks..." />
    </>
  );
}

export default LastfmAlbumTracks;
