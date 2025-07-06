import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import { redirect } from "next/navigation";
import ClientArtistHeader from "./client";

type ArtistHeaderProps = {
  artistName: string;
};

async function ArtistHeader({ artistName }: ArtistHeaderProps) {
  const token = await convexAuthNextjsToken();
  const artistData = await fetchAction(
    api.pollster.artist.getCachedArtist,
    { artistName },
    { token },
  );

  if (!artistData) return redirect("/not-found");

  return <ClientArtistHeader artistData={artistData} />;
}

export default ArtistHeader;
