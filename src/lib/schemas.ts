import { z } from "zod";

const imageFileSizeLimit = 5 * 1024 * 1024; // 5MB

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
  newName: z.string().min(1).max(15),
  newUsername: z.string().min(1).max(25),
  newAboutMe: z.nullable(z.string().max(250)),
  oldHeaderImg: z.nullable(z.string()),
  oldProfileIcon: z.nullable(z.string()),
});
