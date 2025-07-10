"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

export const verifyTurnstile = action({
  args: { token: v.string() },
  handler: async (_, args) => {
    if (process.env.CONVEX_ENV !== "production")
      return { success: true, status: 200 };

    const formData = new FormData();
    formData.append("secret", process.env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY!);
    formData.append("response", args.token);

    try {
      const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        return { success: true, status: 200 };
      } else {
        return { success: false, error: data["error-codes"], status: 401 };
      }
    } catch (error: unknown) {
      return { success: false, error, status: 500 };
    }
  },
});
