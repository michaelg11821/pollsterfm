import BackLink from "@/app/components/layout/back-link";
import PageShell from "@/app/components/layout/page-shell";
import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import CreateReview from "../components/create-review/create-review";

type CreateReviewPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: `Create Review | ${SITE_NAME}`,
  description: `Log in to create a review on ${SITE_NAME}!`,
};

async function CreateReviewPage({ searchParams }: CreateReviewPageProps) {
  const token = await convexAuthNextjsToken();
  const user = await fetchQuery(api.user.currentUser, {}, { token });

  const { type, artist, album, track, image } = await searchParams;

  const itemType =
    type === "artist" || type === "album" || type === "track" ? type : "artist";

  const artistStr = typeof artist === "string" ? artist : undefined;
  const albumStr = typeof album === "string" ? album : undefined;
  const trackStr = typeof track === "string" ? track : undefined;
  const imageStr = typeof image === "string" ? image : undefined;

  if (!user) {
    const queryParams = new URLSearchParams();

    queryParams.set("redirectTo", "/create-review");

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
        <BackLink href="/reviews" label="Back to reviews" />
      </div>
      <h1 className="mb-6 text-3xl font-bold">New Review</h1>
      <CreateReview
        initItemType={itemType}
        initArtist={artistStr}
        initAlbum={albumStr}
        initTrack={trackStr}
        initImage={imageStr}
      />
    </PageShell>
  );
}

export default CreateReviewPage;
