"use client";

import { getLastfmAlbumTracks } from "@/lib/lastfm/album";
import { toastManager } from "@/lib/toast";
import { LastfmAlbumInfoResponse } from "@/lib/types/lastfmResponses";
import { secondsToDuration } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import LoadingIndicator from "../ui/loading-indicator";

type LastfmAlbumTracksProps = {
  artistName: string;
  albumName: string;
};

const INITIAL_VISIBLE_COUNT = 20;

function LastfmAlbumTracks({ artistName, albumName }: LastfmAlbumTracksProps) {
  const [tracks, setTracks] = useState<
    LastfmAlbumInfoResponse["album"]["tracks"]["track"]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const loadingRef = useRef<boolean>(false);

  const getTracks = useCallback(async () => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);

      const response = await getLastfmAlbumTracks(artistName, albumName);

      if (!response || !response.track) {
        throw new Error(
          `Failed to get tracks for ${albumName}. Please refresh the page.`,
        );
      }

      setTracks((prevTracks) => {
        const newTracks = [...prevTracks, ...response.track];

        return newTracks;
      });
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
  }, [artistName, albumName]);

  useEffect(() => {
    getTracks();
  }, [getTracks]);

  const trackItems = useMemo(() => {
    return tracks.slice(0, visibleCount).map((track, index) => (
      <Link
        key={`${track.name}-${index}`}
        className="bg-foreground/5 hover:bg-foreground/10 flex cursor-pointer items-center gap-3 rounded-xl px-2 py-3 transition-[background-color]"
        href={`/catalog/${artistName}/discography/${encodeURIComponent(albumName)}/${encodeURIComponent(track.name)}`}
      >
        <div className="text-muted-foreground w-8 text-center">
          {track["@attr"].rank}
        </div>
        <div className="min-w-0 flex-1">{track.name}</div>
        <div className="text-muted-foreground/50 text-sm">
          {secondsToDuration(track.duration)}
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
