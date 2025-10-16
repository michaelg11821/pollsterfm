import { api } from "@/lib/convex/_generated/api";
import type { CatalogItemType } from "@/lib/types/pollster";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import { redirect } from "next/navigation";
import ClientCatalogHeader from "./client";

type CatalogHeaderProps = {
  itemType: CatalogItemType;
  artistName: string;
  albumName?: string;
  trackName?: string;
};

async function CatalogHeader({
  itemType,
  artistName,
  albumName,
  trackName,
}: CatalogHeaderProps) {
  const token = await convexAuthNextjsToken();
  const artistData = await fetchAction(
    api.pollster.artist.getCachedArtist,
    { artistName },
    { token },
  );

  if (!artistData) return redirect("/not-found");

  let data = artistData;

  if (itemType === "album" || itemType === "track") {
    const albumData = await fetchAction(
      api.pollster.album.getCachedAlbum,
      { artistName: artistData.name, albumName: albumName! },
      { token },
    );

    if (!albumData) redirect("/not-found");

    data = albumData;

    if (itemType === "track") {
      const trackData = await fetchAction(
        api.pollster.track.getCachedTrack,
        {
          artistName: artistData.name,
          albumName: albumData.name,
          albumImage: albumData.image,
          trackName: trackName!,
        },
        { token },
      );

      if (!trackData) redirect("/not-found");

      data = trackData;
    }
  }

  return <ClientCatalogHeader data={data} itemType={itemType} />;
}

export default CatalogHeader;
