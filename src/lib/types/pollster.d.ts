import type { Infer } from "convex/values";
import { affinities } from "../constants/affinities";
import { pollTypes } from "../constants/polls";
import type { Id } from "../convex/_generated/dataModel";
import { choiceValidator, pollValidator } from "../convex/validators";

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

export type Choice = Infer<typeof choiceValidator>;

export type Poll = Infer<typeof pollValidator> & {
  _id: Id<"polls">;
  _creationTime: number;
};
