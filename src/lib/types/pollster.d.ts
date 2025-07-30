import { affinities } from "../constants/affinities";
import { pollTypes } from "../constants/polls";
import type { Id } from "../convex/_generated/dataModel";

type TopAlbumImage = {
  url: string;
};

export type TopAlbum = {
  name: string;
  images: TopAlbumImage[];
  releaseDate: string | null;
  // rating
};

export type PollsterAlbum = TopAlbum;

export type SimilarArtist = {
  name: string;
  image: string | null;
};

export type PollType = (typeof pollTypes)[number];

export type Affinity = (typeof affinities)[number];

export type Choice = {
  artist: string;
  album: string | null;
  track: string | null;
  image: string;
  affinities: Affinity[];
};

export type Poll = {
  _id: Id<"polls">;
  _creationTime: number;
  description?: string | undefined;
  author: string;
  question: string;
  duration: number;
  pollType: string;
  choices: Choice[];
};
