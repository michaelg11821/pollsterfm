"use client";

import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import TopAffinitiesBase from "./base";

type TopTrackAffinitiesProps = {
  artist: string;
  album: string;
  track: string;
};

function TopTrackAffinities({ artist, album, track }: TopTrackAffinitiesProps) {
  const trackAffinities = useQuery(api.pollster.track.getAffinities, {
    amount: 6,
    artist,
    album,
    track,
  });

  return <TopAffinitiesBase affinities={trackAffinities} />;
}

export default TopTrackAffinities;
