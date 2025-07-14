import { api } from "@/lib/convex/_generated/api";
import { fetchAction } from "convex/nextjs";
import ClientAlbumResults from "./client";

type AlbumResultsProps = {
  query: string;
};

async function AlbumResults({ query }: AlbumResultsProps) {
  const albums = await fetchAction(api.pollster.album.search, { query });

  if (!albums)
    return (
      <section>
        <div className="mb-6">
          <h2 className="flex items-center text-2xl font-bold">Albums</h2>
        </div>
        <p>No results found.</p>
      </section>
    );

  return <ClientAlbumResults albums={albums} />;
}

export default AlbumResults;
