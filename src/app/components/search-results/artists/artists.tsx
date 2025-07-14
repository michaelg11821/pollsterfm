import { api } from "@/lib/convex/_generated/api";
import { fetchAction } from "convex/nextjs";
import ClientArtistResults from "./client";

type ArtistResultsProps = {
  query: string;
};

async function ArtistResults({ query }: ArtistResultsProps) {
  const artists = await fetchAction(api.pollster.artist.search, { query });

  if (!artists)
    return (
      <section>
        <div className="mb-6">
          <h2 className="flex items-center text-2xl font-bold">Artists</h2>
        </div>
        <p>No results found.</p>
      </section>
    );

  return <ClientArtistResults artists={artists} />;
}

export default ArtistResults;
