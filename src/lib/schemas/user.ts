"use server";

import { z } from "zod";

const imageFileSizeLimit = 5 * 1024 * 1024; // 5 MB

function makeFileBytesSchema(
  acceptedMimeTypes: readonly string[],
  invalidTypeMessage: string
) {
  return z
    .object({
      bytes: z
        .instanceof(Uint8Array)
        .refine((b) => b.byteLength <= imageFileSizeLimit, {
          message: "File size should not exceed 5MB.",
        }),
      name: z.string(),
      mimeType: z.string().refine((t) => acceptedMimeTypes.includes(t), {
        message: invalidTypeMessage,
      }),
    })
    .passthrough();
}

export const headerImageSchema = z.nullable(
  makeFileBytesSchema(
    ["image/png", "image/jpeg", "image/webp"],
    "Invalid file type. Accepted file types: .png, .jpeg, and .webp."
  )
);

export const profileIconSchema = z.nullable(
  makeFileBytesSchema(
    ["image/png", "image/jpeg", "image/webp", "image/gif"],
    "Invalid file type. Accepted file types: .png, .jpeg, .webp, and .gif."
  )
);
