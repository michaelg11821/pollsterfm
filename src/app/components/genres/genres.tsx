import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import ClientGenres from "./client";
import { noGenresMsg } from "./config";

type GenresProps = {
  category: "artist" | "album" | "track";
  itemName: string;
};

async function Genres({ category, itemName }: GenresProps) {
  const token = await convexAuthNextjsToken();

  switch (category) {
    case "artist":
      const artistData = await fetchAction(
        api.pollster.artist.getCachedArtist,
        { artistName: itemName },
        { token },
      );

      if (!artistData || !artistData.genres) return <p>{noGenresMsg}</p>;

      return <ClientGenres itemData={artistData} category="artist" />;
  }
}

export default Genres;
