"use client";

import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import TopAffinitiesBase from "./base";

type TopAlbumAffinitiesProps = {
  artist: string;
  album: string;
};

function TopAlbumAffinities({ artist, album }: TopAlbumAffinitiesProps) {
  const albumAffinities = useQuery(api.pollster.album.getAffinities, {
    amount: 6,
    artist,
    album,
  });

  return <TopAffinitiesBase affinities={albumAffinities} />;
}

export default TopAlbumAffinities;
