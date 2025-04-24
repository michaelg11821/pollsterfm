"use server";

/**
 * A function that verifies tokens from the Cloudflare Turnstile on the sign-in page.
 *
 * @param token A Cloudflare turnstile token.
 * @returns A success indicator, status, and possible errors.
 */
export async function verifyTurnstile(token: string) {
  if (process.env.NODE_ENV !== "production") return { success: true };

  const formData = new FormData();
  formData.append("secret", process.env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY!);
  formData.append("response", token);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
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
}
