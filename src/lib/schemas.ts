import { z } from "zod";

const imageFileSizeLimit = 5 * 1024 * 1024; // 5MB

export const headerImageSchema = z
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
  });

export const profileIconSchema = z
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
  });

export const profileSchema = z.object({
  headerImage: headerImageSchema,
  profileIcon: profileIconSchema,
  name: z.string().min(1).max(15),
  username: z.string().min(1).max(20),
  aboutMe: z.string().max(250),
});
