import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { ChevronLeft } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreatePoll from "../components/create-poll/create-poll";

type CreatePollPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: `Create Poll | ${SITE_NAME}`,
  description: `Log in to create a poll on ${SITE_NAME}!`,
};

async function CreatePollPage({ searchParams }: CreatePollPageProps) {
  const token = await convexAuthNextjsToken();
  const user = await fetchQuery(api.user.currentUser, {}, { token });

  const { type, artist, album, track, image } = await searchParams;

  const pollType =
    type === "artist" || type === "album" || type === "track" ? type : "artist";

  const artistStr = typeof artist === "string" ? artist : undefined;
  const albumStr = typeof album === "string" ? album : undefined;
  const trackStr = typeof track === "string" ? track : undefined;
  const imageStr = typeof image === "string" ? image : undefined;

  if (!user) {
    const queryParams = new URLSearchParams();

    queryParams.set("redirectTo", "/create-poll");

    if (type)
      queryParams.set("type", typeof type === "string" ? type : type[0] || "");

    if (artist)
      queryParams.set(
        "artist",
        typeof artist === "string" ? artist : artist[0] || "",
      );

    if (album)
      queryParams.set(
        "album",
        typeof album === "string" ? album : album[0] || "",
      );

    if (track)
      queryParams.set(
        "track",
        typeof track === "string" ? track : track[0] || "",
      );

    if (image)
      queryParams.set(
        "image",
        typeof image === "string" ? image : image[0] || "",
      );

    return redirect(`/sign-in?${queryParams.toString()}`);
  }

  return (
    <main className="content-wrapper px-5 py-8 xl:px-0">
      <Link
        href="/polls"
        className="text-primary hover:text-ring/50 mb-4 inline-flex items-center text-sm no-underline transition-[color]"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to polls
      </Link>
      <h2 className="mb-6 text-3xl font-bold">New Poll</h2>
      <CreatePoll
        initPollType={pollType}
        initArtist={artistStr}
        initAlbum={albumStr}
        initTrack={trackStr}
        initImage={imageStr}
      />
    </main>
  );
}

export default CreatePollPage;
