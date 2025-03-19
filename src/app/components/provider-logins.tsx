"use client";

import { signIn } from "next-auth/react";
import { Turnstile } from "next-turnstile";
import { useState } from "react";

function ProviderLogins() {
  const [turnstileStatus, setTurnstileStatus] = useState<
    "success" | "error" | "expired" | "required"
  >("required");
  const [error, setError] = useState<string>("");

  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        type="submit"
        onClick={
          turnstileStatus !== "success"
            ? () => setError("Please complete the challenge first.")
            : () => signIn("spotify")
        }
        disabled={turnstileStatus !== "success"}
      >
        Sign in with Spotify
      </button>
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        retry="auto"
        refreshExpired="auto"
        sandbox={process.env.NODE_ENV === "development"}
        onLoad={() => {
          setTurnstileStatus("required");
          setError("");
        }}
        onError={() => {
          setTurnstileStatus("error");
          setError("Please try again.");
        }}
        onExpire={() => {
          setTurnstileStatus("expired");
          setError("Security check expired.");
        }}
        onVerify={(token: string) => {
          setTurnstileStatus("success");
          setError("");
        }}
      />
    </>
  );
}

export default ProviderLogins;
