"use client";

import TopAlbumAffinities from "./album";
import TopArtistAffinities from "./artist";
import TopTrackAffinities from "./track";
import TopUserAffinities from "./user";

type TopAffinitiesProps = {
  category: "user" | "artist" | "album" | "track";
  itemName: string;
};

function TopAffinities({ category, itemName }: TopAffinitiesProps) {
  return (
    <>
      {category === "user" ? (
        <TopUserAffinities username={itemName} />
      ) : category === "artist" ? (
        <TopArtistAffinities artist={itemName} />
      ) : category === "album" ? (
        <TopAlbumAffinities album={itemName} />
      ) : category === "track" ? (
        <TopTrackAffinities track={itemName} />
      ) : null}
    </>
  );
}

export default TopAffinities;
