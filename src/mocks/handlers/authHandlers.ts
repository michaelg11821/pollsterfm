import { http, HttpResponse } from "msw";

interface VerificationBody {
  token: string;
}

export const verifyTurnstileHandler = http.post(
  "/api/verify-turnstile",
  async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const { token } = (await request.json()) as VerificationBody;

    if (token === "valid-mock-token") {
      return HttpResponse.json({ success: true }, { status: 200 });
    }

    return HttpResponse.json(
      {
        success: false,
        "error-codes": ["invalid-input-response"],
      },
      { status: 400 }
    );
  }
);
