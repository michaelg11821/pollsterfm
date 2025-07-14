"use client";

import type { Track as SpotifyTrack } from "@/lib/types/spotify";
import Track from "../../track/track";

type ClientTrackResultsProps = {
  tracks: SpotifyTrack[];
};

function ClientTrackResults({ tracks }: ClientTrackResultsProps) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="flex items-center text-2xl font-bold">Tracks</h2>
      </div>

      <div className="space-y-2">
        {tracks.map((track, index) => (
          <Track
            key={`track-${index}`}
            album={track.album}
            trackTitle={track.name}
            duration={track.duration_ms}
          />
        ))}
      </div>
    </section>
  );
}

export default ClientTrackResults;
