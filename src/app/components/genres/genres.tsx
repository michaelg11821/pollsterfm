import { findFirstArtistByName } from "@/lib/pollster/artist";

import ClientGenres from "./client";
import { noGenresMsg } from "./config";

type GenresProps = {
  category: "artist" | "album" | "track";
  itemName: string;
};

async function Genres({ category, itemName }: GenresProps) {
  switch (category) {
    case "artist":
      const artistData = await findFirstArtistByName(itemName);

      if (!artistData || !artistData.genres) return <p>{noGenresMsg}</p>;

      return (
        <ClientGenres
          itemData={artistData}
          originalQuery={itemName}
          category="artist"
        />
      );
  }
}

export default Genres;
