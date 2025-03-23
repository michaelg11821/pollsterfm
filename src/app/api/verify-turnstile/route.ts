import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  if (process.env.NODE_ENV !== "production")
    return NextResponse.json({ success: true });

  const formData = new FormData();
  formData.append("secret", process.env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY!);
  formData.append("response", token);

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (data.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, error: data["error-codes"] });
  }
}
