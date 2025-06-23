import { findFirstAlbumByName } from "@/lib/pollster/album";
import { findFirstArtistByName } from "@/lib/pollster/artist";
import { findFirstTrackByName } from "@/lib/pollster/track";
import { redirect } from "next/navigation";
import ClientTrackHeader from "./client";

type TrackHeaderProps = {
  artistName: string;
  albumName: string;
  trackName: string;
};

async function TrackHeader({
  artistName,
  albumName,
  trackName,
}: TrackHeaderProps) {
  const artistData = await findFirstArtistByName(artistName);

  if (!artistData) return redirect("/not-found");

  const albumData = await findFirstAlbumByName(artistData, albumName);

  if (!albumData) return redirect("/not-found");

  const trackData = await findFirstTrackByName(albumData, trackName);

  if (!trackData) return redirect("/not-found");

  return <ClientTrackHeader trackData={trackData} />;
}

export default TrackHeader;
