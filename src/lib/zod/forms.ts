import { z } from "zod";
import { getImageHostnamesRegex } from "../utils";
import { Affinity, PollType } from "./pollster";
import { headerImageSchema, profileIconSchema } from "./user";

export const editProfileSchema = z.object({
  newHeaderImg: headerImageSchema,
  newProfileIcon: profileIconSchema,
  newName: z
    .string()
    .trim()
    .min(1, { message: "Name must be at least 1 character long." })
    .max(15, { message: "Name cannot be longer than 15 characters." }),
  newUsername: z
    .string()
    .trim()
    .refine((value) => !/\s/.test(value), {
      message: "Username cannot contain spaces.",
    })
    .transform((value) => value.replace(/\s+/g, ""))
    .pipe(
      z
        .string()
        .toLowerCase()
        .min(3, { message: "Username must be at least 3 characters long." })
        .max(25, { message: "Username cannot be longer than 25 characters." }),
    ),
  newAboutMe: z.optional(
    z
      .string()
      .max(250, { message: "About Me cannot be longer than 250 characters." })
      .trim(),
  ),
  deleteHeaderImg: z.boolean(),
  deleteProfileIcon: z.boolean(),
});

const baseChoice = z.object({
  image: z.url().or(z.literal("")),
  artist: z.string(),
  album: z.string().nullable(),
  track: z.string().nullable(),
  affinities: z
    .array(Affinity)
    .min(1, { error: "At least 1 affinity is required." })
    .max(3, { error: "A choice cannot have more than 3 affinities." }),
});

const artistChoice = baseChoice.extend({
  artist: z.string().min(1, { error: "Please select an artist." }),
  album: z.null(),
  track: z.null(),
  image: z
    .url({
      hostname: getImageHostnamesRegex(),
      error: "Image is from an untrusted source.",
    })
    .or(z.literal("")),
});

const albumChoice = baseChoice.extend({
  artist: z.string().min(1, { error: "Please select an artist." }),
  album: z.string({ error: "Please select an album." }),
  track: z.null(),
  image: z
    .url({
      hostname: getImageHostnamesRegex(),
      error: "Image is from an untrusted source.",
    })
    .or(z.literal("")),
});

const trackChoice = baseChoice.extend({
  artist: z.string().min(1, { error: "Please select an artist." }),
  album: z.string({ error: "Please select an album." }),
  track: z.string({ error: "Please select a track." }),
  image: z
    .url({
      hostname: getImageHostnamesRegex(),
      error: "Image is from an untrusted source.",
    })
    .or(z.literal("")),
});

const pollSchema = z.object({
  question: z
    .string({ error: "A question is required." })
    .min(5, { error: "Question must be at least 5 characters long." })
    .max(50, { error: "Question cannot be longer than 50 characters." }),
  description: z
    .string()
    .max(250, {
      error: "Description cannot be longer than 250 characters.",
    })
    .optional(),
  duration: z.string({ error: "A duration is required." }),
  pollType: PollType,
  choices: z.array(z.any()),
});

export const createPollSchema = z.discriminatedUnion("pollType", [
  pollSchema.extend({
    pollType: z.literal("artist"),
    choices: z
      .array(artistChoice)
      .min(2, { error: "Polls must have at least 2 choices." })
      .max(5, { error: "Polls cannot have more than 5 choices." }),
  }),
  pollSchema.extend({
    pollType: z.literal("album"),
    choices: z
      .array(albumChoice)
      .min(2, { error: "Polls must have at least 2 choices." })
      .max(5, { error: "Polls cannot have more than 5 choices." }),
  }),
  pollSchema.extend({
    pollType: z.literal("track"),
    choices: z
      .array(trackChoice)
      .min(2, { error: "Polls must have at least 2 choices." })
      .max(5, { error: "Polls cannot have more than 5 choices." }),
  }),
]);
