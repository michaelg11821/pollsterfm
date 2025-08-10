"use client";

import { useState } from "react";

import { Turnstile } from "@marsidev/react-turnstile";

import Image from "next/image";

import { profilePath } from "./config";

import { useAuthActions } from "@convex-dev/auth/react";

import { api } from "@/lib/convex/_generated/api";
import { toastManager } from "@/lib/toast";
import { useAction } from "convex/react";
import { Loader2 } from "lucide-react";
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

  const allParams = new URLSearchParams();

  for (const [key, value] of searchParams.entries()) {
    if (key !== "redirectTo") {
      allParams.set(key, value);
    }
  }

  const fullRedirectPath = decodedRedirectPath
    ? allParams.toString()
      ? `${decodedRedirectPath}?${allParams.toString()}`
      : decodedRedirectPath
    : null;

  const { signIn } = useAuthActions();

  const verifyTurnstile = useAction(api.misc.verifyTurnstile);

  const handleSignIn = async () => {
    if (!turnstileToken) {
      return toastManager.add({
        title: "Error",
        description: "Please complete the verification.",
      });
    }

    try {
      setLoading(true);

      const result = await verifyTurnstile({ token: turnstileToken });

      if (result.success) {
        return void signIn("spotify", {
          redirectTo: fullRedirectPath ?? profilePath,
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
      <Button
        variant="outline"
        size="lg"
        className="min-w-62 cursor-pointer gap-2.5 py-5.5"
        type="button"
        onClick={handleSignIn}
        disabled={!turnstileToken || loading}
      >
        {!loading ? (
          <>
            {" "}
            <Image src={SpotifySvg} width={30} height={30} alt="" priority />
            Sign in with Spotify
          </>
        ) : (
          <Loader2 className="h-5 w-62 animate-spin" />
        )}
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
