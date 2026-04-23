"use client";

import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import TopAffinitiesBase from "./base";

type TopArtistAffinitiesProps = {
  artist: string;
};

function TopArtistAffinities({ artist }: TopArtistAffinitiesProps) {
  const artistAffinities = useQuery(api.pollster.artist.getAffinities, {
    amount: 6,
    artist,
  });

  return <TopAffinitiesBase affinities={artistAffinities} />;
}

export default TopArtistAffinities;
