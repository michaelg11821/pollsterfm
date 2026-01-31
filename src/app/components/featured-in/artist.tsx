import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import FeaturedInBase from "./base";

type ArtistFeaturedInProps = {
  artistName: string;
};

function ArtistFeaturedIn({ artistName }: ArtistFeaturedInProps) {
  const featuredPolls = useQuery(api.pollster.artist.getPollsFeaturedIn, {
    artist: artistName,
  });

  return <FeaturedInBase featuredPolls={featuredPolls} />;
}

export default ArtistFeaturedIn;
