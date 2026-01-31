import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import FeaturedInBase from "./base";

type AlbumFeaturedInProps = {
  artistName: string;
  albumName: string;
};

function AlbumFeaturedIn({ artistName, albumName }: AlbumFeaturedInProps) {
  const featuredPolls = useQuery(api.pollster.album.getPollsFeaturedIn, {
    artist: artistName,
    album: albumName,
  });

  return <FeaturedInBase featuredPolls={featuredPolls} />;
}

export default AlbumFeaturedIn;
