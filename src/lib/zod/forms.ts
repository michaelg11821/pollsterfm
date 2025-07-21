import { z } from "zod";
import { oneDayMs, oneMonthMs } from "../constants/time";
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

export const createPollSchema = z.object({
  question: z
    .string({ error: "A question is required." })
    .min(5, {
      message: "Question must be at least 5 characters long.",
    })
    .max(50, { message: "Question cannot be longer than 50 characters." }),
  description: z.optional(
    z.string().max(250, {
      message: "Description cannot be longer than 250 characters.",
    }),
  ),
  duration: z
    .number({ error: "A duration is required." })
    .min(oneDayMs, { message: "Duration cannot be shorter than a day." })
    .max(oneMonthMs, { message: "Duration cannot be longer than 1 month." }),
  pollType: PollType,
  choices: z
    .array(
      z.object({
        image: z.url({
          hostname: getImageHostnamesRegex(),
          error: "Image is from an untrusted source.",
        }),
        artist: z.string(),
        album: z.nullable(z.string()),
        track: z.nullable(z.string()),
        affinities: z
          .array(Affinity, { error: "At least 1 affinity is required." })
          .max(3, "A choice cannot have more than 3 affinities."),
      }),
      { error: "Choices are required." },
    )
    .min(2, "Polls must have at least 2 choices."),
});
