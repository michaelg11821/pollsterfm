import { z } from "zod";

const imageFileSizeLimit = 5 * 1024 * 1024;

export const headerImageSchema = z.nullable(
  z
    .instanceof(File)
    .refine(
      (file) => ["image/png", "image/jpeg", "image/webp"].includes(file.type),
      {
        message:
          "Invalid file type. Accepted file types: .png, .jpeg, and .webp.",
      }
    )
    .refine((file) => file.size <= imageFileSizeLimit, {
      message: "File size should not exceed 5MB.",
    })
);

export const profileIconSchema = z.nullable(
  z
    .instanceof(File)
    .refine(
      (file) =>
        ["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
          file.type
        ),
      {
        message:
          "Invalid file type. Accepted file types: .png, .jpeg, .webp, and .gif.",
      }
    )
    .refine((file) => file.size <= imageFileSizeLimit, {
      message: "File size should not exceed 5MB.",
    })
);

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
        .max(25, { message: "Username cannot be longer than 25 characters." })
    ),
  newAboutMe: z.nullable(
    z
      .string()
      .max(250, { message: "About Me cannot be longer than 250 characters." })
      .trim()
  ),
  oldHeaderImg: z.nullable(z.string()),
  oldProfileIcon: z.nullable(z.string()),
  deleteHeaderImg: z.boolean(),
  deleteProfileIcon: z.boolean(),
});
