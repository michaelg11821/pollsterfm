import { api } from "@/lib/convex/_generated/api";
import { fetchAction } from "convex/nextjs";
import ClientTrackResults from "./client";

type TrackResultsProps = {
  query: string;
};

async function TrackResults({ query }: TrackResultsProps) {
  const tracks = await fetchAction(api.pollster.track.search, { query });

  if (!tracks) return <p>No results found.</p>;

  return <ClientTrackResults tracks={tracks} />;
}

export default TrackResults;
