import { api } from "@/lib/convex/_generated/api";
import { fetchAction } from "convex/nextjs";
import ClientAlbumResults from "./client";

type AlbumResultsProps = {
  query: string;
};

async function AlbumResults({ query }: AlbumResultsProps) {
  const albums = await fetchAction(api.pollster.album.search, { query });

  if (!albums) return <p>No results found.</p>;

  return <ClientAlbumResults albums={albums} />;
}

export default AlbumResults;
