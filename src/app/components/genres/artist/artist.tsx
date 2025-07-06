import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import { redirect } from "next/navigation";
import ClientArtistGenres from "./client";

type ArtistGenresProps = {
  artistName: string;
};

async function ArtistGenres({ artistName }: ArtistGenresProps) {
  const token = await convexAuthNextjsToken();

  const artistData = await fetchAction(
    api.pollster.artist.getCachedArtist,
    { artistName },
    { token },
  );

  if (!artistData) return redirect("/not-found");

  return <ClientArtistGenres artistData={artistData} />;
}

export default ArtistGenres;
