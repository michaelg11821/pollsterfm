"use client";

import { signIn } from "next-auth/react";
import { Turnstile } from "next-turnstile";
import { useState } from "react";

import Image from "next/image";

import SpotifySvg from "../../../../public/spotify.svg";

import styles from "./provider-logins.module.css";

function ProviderLogins() {
  const [turnstileStatus, setTurnstileStatus] = useState<
    "success" | "error" | "expired" | "required"
  >("required");
  const [error, setError] = useState<string>("");

  return (
    <div className={styles.providerLogins}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        type="button"
        onClick={
          turnstileStatus !== "success"
            ? () => setError("Please complete the challenge first.")
            : () => signIn("spotify")
        }
        disabled={turnstileStatus !== "success"}
      >
        <Image src={SpotifySvg} width={30} height={30} alt="" priority />
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
        onVerify={() => {
          setTurnstileStatus("success");
          setError("");
        }}
      />
    </div>
  );
}

export default ProviderLogins;
