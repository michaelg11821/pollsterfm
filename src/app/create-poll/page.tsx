import BackLink from "@/app/components/layout/back-link";
import PageShell from "@/app/components/layout/page-shell";
import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { type Metadata } from "next";
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
    <PageShell>
      <div className="mb-6">
        <BackLink href="/polls" label="Back to polls" />
      </div>
      <h1 className="mb-6 text-3xl font-bold">New Poll</h1>
      <CreatePoll
        initPollType={pollType}
        initArtist={artistStr}
        initAlbum={albumStr}
        initTrack={trackStr}
        initImage={imageStr}
      />
    </PageShell>
  );
}

export default CreatePollPage;
