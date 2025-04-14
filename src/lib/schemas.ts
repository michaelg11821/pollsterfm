import { z } from "zod";

const imageFileSizeLimit = 5 * 1024 * 1024; // 5MB
const imageFile = z
  .instanceof(File)
  .refine(
    (file) =>
      ["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type),
    { message: "Accepted file types are .png, .jpeg, .jpg, .webp, and .gif." }
  )
  .refine((file) => file.size <= imageFileSizeLimit, {
    message: "File size should not exceed 5MB.",
  });

export const profileSchema = z.object({
  headerImage: imageFile,
  profileIcon: imageFile,
  name: z.string().min(1).max(15),
  username: z.string().min(1).max(20),
  aboutMe: z.string().max(250),
});
