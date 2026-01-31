import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import FeaturedInBase from "./base";

type TrackFeaturedInProps = {
  artistName: string;
  albumName: string;
  trackName: string;
};

function TrackFeaturedIn({
  artistName,
  albumName,
  trackName,
}: TrackFeaturedInProps) {
  const featuredPolls = useQuery(api.pollster.track.getPollsFeaturedIn, {
    artist: artistName,
    album: albumName,
    track: trackName,
  });

  return <FeaturedInBase featuredPolls={featuredPolls} />;
}

export default TrackFeaturedIn;
