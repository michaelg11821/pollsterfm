import { z } from "zod";
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
  newAboutMe: z.nullable(
    z
      .string()
      .max(250, { message: "About Me cannot be longer than 250 characters." })
      .trim(),
  ),
  oldHeaderImg: z.nullable(z.string()),
  oldProfileIcon: z.nullable(z.string()),
  deleteHeaderImg: z.boolean(),
  deleteProfileIcon: z.boolean(),
});
