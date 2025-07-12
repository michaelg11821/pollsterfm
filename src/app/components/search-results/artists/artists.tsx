import { api } from "@/lib/convex/_generated/api";
import { fetchAction } from "convex/nextjs";
import ClientArtistResults from "./client";

type ArtistResultsProps = {
  query: string;
};

async function ArtistResults({ query }: ArtistResultsProps) {
  const artists = await fetchAction(api.pollster.artist.search, { query });

  if (!artists) return <p>No results found.</p>;

  return <ClientArtistResults artists={artists} />;
}

export default ArtistResults;
