"use client";

import type { PollType } from "@/lib/types/pollster";
import AlbumFeaturedIn from "./album";
import ArtistFeaturedIn from "./artist";
import TrackFeaturedIn from "./track";

type FeaturedInProps = {
  category: PollType;
  artistName: string;
  albumName?: string;
  trackName?: string;
};

function FeaturedIn({
  category,
  artistName,
  albumName,
  trackName,
}: FeaturedInProps) {
  return category === "artist" ? (
    <ArtistFeaturedIn artistName={artistName} />
  ) : category === "album" && albumName ? (
    <AlbumFeaturedIn artistName={artistName} albumName={albumName} />
  ) : category === "track" && albumName && trackName ? (
    <TrackFeaturedIn
      artistName={artistName}
      albumName={albumName}
      trackName={trackName}
    />
  ) : null;
}

export default FeaturedIn;
