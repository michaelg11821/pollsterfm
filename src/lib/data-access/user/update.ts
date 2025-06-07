"use server";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { editProfileSchema } from "@/lib/schemas/forms";
import { supabase } from "@/lib/supabase";
import { getSupabaseFileName } from "@/lib/utils";

import type { EditProfileFormData } from "@/lib/types/formData";
import type { UpdateProfileResult } from "@/lib/types/internalResponses";
import { ZodError } from "zod";
import { Prisma } from "../../prisma/client";

/**
 * A function that updates the authenticated user's profile with the given form data.
 *
 * Returns detailed error(s) if the Zod parse fails. A less detailed error is returned when Supabase or Prisma fails.
 *
 * @param formData Data from the "Edit Profile" form. Will be validated on both the frontend and the backend.
 * @returns An object with denoting the result's success and an array of any errors present.
 *
 */
export async function updateProfile(
  formData: EditProfileFormData,
): Promise<UpdateProfileResult> {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return redirect("/sign-in");
  }

  try {
    const result = editProfileSchema.parse(formData);

    const {
      newHeaderImg,
      newProfileIcon,
      newName,
      newUsername,
      newAboutMe,
      oldHeaderImg,
      oldProfileIcon,
      deleteHeaderImg,
      deleteProfileIcon,
    } = result;

    let newHeaderImgUrl: string | null = oldHeaderImg;
    let newProfileIconUrl: string | null = oldProfileIcon;

    if (deleteHeaderImg && oldHeaderImg) {
      try {
        const fileName = getSupabaseFileName(new URL(oldHeaderImg));

        await supabase.storage.from("header-images").remove([fileName]);

        newHeaderImgUrl = null;
      } catch (removeError: unknown) {
        console.error(
          `failed to remove old header image for ${user.username}:`,
          removeError,
        );

        throw removeError;
      }
    } else if (newHeaderImg) {
      if (oldHeaderImg) {
        try {
          const fileName = getSupabaseFileName(new URL(oldHeaderImg));

          await supabase.storage.from("header-images").remove([fileName]);
        } catch (removeError: unknown) {
          console.error(
            `failed to remove old header image for ${user.username}:`,
            removeError,
          );

          throw removeError;
        }
      }

      const { data, error: uploadError } = await supabase.storage
        .from("header-images")
        .upload(newHeaderImg.name, newHeaderImg.bytes, {
          contentType: newHeaderImg.mimeType,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("header-images").getPublicUrl(data.path);

      newHeaderImgUrl = publicUrl;
    }

    if (deleteProfileIcon && oldProfileIcon) {
      try {
        const fileName = getSupabaseFileName(new URL(oldProfileIcon));

        await supabase.storage.from("profile-icons").remove([fileName]);

        newProfileIconUrl = null;
      } catch (removeError: unknown) {
        console.error(
          `failed to remove old profile icon for ${user.username}:`,
          removeError,
        );

        throw removeError;
      }
    } else if (newProfileIcon) {
      if (oldProfileIcon) {
        try {
          const oldIconUrl = new URL(oldProfileIcon);
          if (oldIconUrl.origin === process.env.SUPABASE_URL!) {
            const fileName = getSupabaseFileName(oldIconUrl);

            await supabase.storage.from("profile-icons").remove([fileName]);
          }
        } catch (removeError: unknown) {
          console.error(
            `failed to remove old profile icon for ${user.username}:`,
            removeError,
          );

          throw removeError;
        }
      }

      const { data, error: uploadError } = await supabase.storage
        .from("profile-icons")
        .upload(newProfileIcon.name, newProfileIcon.bytes, {
          contentType: newProfileIcon.mimeType,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-icons").getPublicUrl(data.path);

      newProfileIconUrl = publicUrl;
    }

    await prisma.user.update({
      where: {
        username: user.username,
      },
      data: {
        name: newName,
        username: newUsername,
        aboutMe: newAboutMe,
        image: newProfileIconUrl,
        headerImage: newHeaderImgUrl,
      },
    });

    return { success: true };
  } catch (err: unknown) {
    console.error(`error updating profile for ${user.username}:`, err);

    if (err instanceof ZodError) {
      return {
        success: false,
        errors: err.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      };
    } else if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return {
        success: false,
        errors: [
          {
            path: ["newUsername"],
            message: "Username already taken.",
          },
        ],
      };
    }

    return {
      success: false,
      errors: [
        {
          path: ["server"],
          message: "An unexpected server error occurred. Please try again.",
        },
      ],
    };
  }
}
