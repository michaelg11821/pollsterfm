"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Turnstile } from "@marsidev/react-turnstile";

import Image from "next/image";

import SpotifySvg from "../../../../public/spotify.svg";

import styles from "./provider-logins.module.css";

function ProviderLogins() {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!turnstileToken) {
      return setError("Please complete the verification.");
    }

    try {
      setLoading(true);

      const verification = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      });

      const result = await verification.json();

      if (result.success) {
        return signIn("spotify", { callbackUrl: "/profile" });
      } else {
        return setError("Verification failed. Please try again.");
      }
    } catch (err: unknown) {
      console.error(err);

      return setError("Verification failed. Please try again.");
    } finally {
      return setLoading(false);
    }
  };

  return (
    <div className={styles.providerLogins}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Please wait...</p>}
      <button type="button" onClick={handleSignIn} disabled={!turnstileToken}>
        <Image src={SpotifySvg} width={30} height={30} alt="" priority />
        Sign in with Spotify
      </button>
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={(token) => setTurnstileToken(token)}
      />
    </div>
  );
}

export default ProviderLogins;
