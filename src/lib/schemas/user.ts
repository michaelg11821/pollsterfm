import { z } from "zod";

const imageFileSizeLimit = 5 * 1024 * 1024; // 5 MB

function makeFileSchema(
  acceptedMimeTypes: readonly string[],
  invalidTypeMessage: string,
) {
  return z
    .instanceof(File)
    .refine((f) => f.size <= imageFileSizeLimit, {
      message: "File size should not exceed 5MB.",
    })
    .refine((f) => acceptedMimeTypes.includes(f.type), {
      message: invalidTypeMessage,
    });
}

export const headerImageSchemaMessage =
  "Invalid file type. Accepted file types: .png, .jpeg, and .webp.";

export const headerImageSchema = z.nullable(
  makeFileSchema(
    ["image/png", "image/jpeg", "image/webp"],
    headerImageSchemaMessage,
  ),
);

export const profileIconSchemaMessage =
  "Invalid file type. Accepted file types: .png, .jpeg, .webp, and .gif.";

export const profileIconSchema = z.nullable(
  makeFileSchema(
    ["image/png", "image/jpeg", "image/webp", "image/gif"],
    profileIconSchemaMessage,
  ),
);
