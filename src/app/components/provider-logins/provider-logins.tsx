"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Turnstile } from "@marsidev/react-turnstile";

import Image from "next/image";

import { profilePath } from "./config";

import { verifyTurnstile } from "../../../lib/actions";

import { toastManager } from "@/lib/toast";
import { useSearchParams } from "next/navigation";
import SpotifySvg from "../../../../public/spotify.svg";
import { Button } from "../ui/button";

function ProviderLogins() {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirectTo");
  const decodedRedirectPath = redirectPath
    ? decodeURIComponent(redirectPath)
    : null;

  const handleSignIn = async () => {
    if (!turnstileToken) {
      return toastManager.add({
        title: "Error",
        description: "Please complete the verification.",
      });
    }

    try {
      setLoading(true);

      const result = await verifyTurnstile(turnstileToken);

      if (result.success) {
        return signIn("spotify", {
          redirectTo: decodedRedirectPath ?? profilePath,
        });
      } else {
        return toastManager.add({
          title: "Error",
          description: "Verification failed. Please try again.",
        });
      }
    } catch (err: unknown) {
      console.error(err);

      return toastManager.add({
        title: "Error",
        description: "Verification failed. Please try again.",
      });
    } finally {
      return setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
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
        onError={() =>
          toastManager.add({
            title: "Error",
            description: "Verification failed. Please try again.",
          })
        }
      />
    </div>
  );
}

export default ProviderLogins;
