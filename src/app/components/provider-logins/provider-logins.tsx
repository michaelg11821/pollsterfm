"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Turnstile } from "@marsidev/react-turnstile";

import Image from "next/image";

import { callbackUrl } from "./config";

import { verifyTurnstile } from "../../../lib/actions";

import SpotifySvg from "../../../../public/spotify.svg";
import { Button } from "../ui/button";

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

      const result = await verifyTurnstile(turnstileToken);

      if (result.success) {
        return signIn("spotify", { callbackUrl });
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
    <div className="flex flex-col items-center justify-center gap-6">
      {error && <p className="text-primary">{error}</p>}
      {loading && <p>Please wait...</p>}
      <Button
        variant="outline"
        size="lg"
        className="cursor-pointer gap-2.5 py-5.5"
        type="button"
        onClick={handleSignIn}
        disabled={!turnstileToken}
      >
        <Image src={SpotifySvg} width={30} height={30} alt="" priority />
        Sign in with Spotify
      </Button>
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={(token) => setTurnstileToken(token)}
        onError={() => setError("Verification failed. Please try again.")}
      />
    </div>
  );
}

export default ProviderLogins;
