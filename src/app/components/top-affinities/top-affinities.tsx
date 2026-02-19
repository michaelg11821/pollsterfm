"use client";

import TopAlbumAffinities from "./album";
import TopArtistAffinities from "./artist";
import TopTrackAffinities from "./track";
import TopUserAffinities from "./user";

type TopAffinitiesProps =
  | {
      category: "user";
      itemName: string;
    }
  | {
      category: "artist";
      artistName: string;
    }
  | {
      category: "album";
      artistName: string;
      albumName: string;
    }
  | {
      category: "track";
      artistName: string;
      albumName: string;
      trackName: string;
    };

function TopAffinities(props: TopAffinitiesProps) {
  return (
    <>
      {props.category === "user" ? (
        <TopUserAffinities username={props.itemName} />
      ) : props.category === "artist" ? (
        <TopArtistAffinities artist={props.artistName} />
      ) : props.category === "album" ? (
        <TopAlbumAffinities artist={props.artistName} album={props.albumName} />
      ) : props.category === "track" ? (
        <TopTrackAffinities
          artist={props.artistName}
          album={props.albumName}
          track={props.trackName}
        />
      ) : null}
    </>
  );
}

export default TopAffinities;
