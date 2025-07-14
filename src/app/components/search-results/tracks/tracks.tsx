import { api } from "@/lib/convex/_generated/api";
import { fetchAction } from "convex/nextjs";
import ClientTrackResults from "./client";

type TrackResultsProps = {
  query: string;
};

async function TrackResults({ query }: TrackResultsProps) {
  const tracks = await fetchAction(api.pollster.track.search, { query });

  if (!tracks)
    return (
      <section>
        <div className="mb-6">
          <h2 className="flex items-center text-2xl font-bold">Tracks</h2>
        </div>
        <p>No results found.</p>
      </section>
    );

  return <ClientTrackResults tracks={tracks} />;
}

export default TrackResults;
