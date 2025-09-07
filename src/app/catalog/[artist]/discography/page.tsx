import Discography from "@/app/components/discography/discography";
import DiscographySkeleton from "@/app/components/discography/skeleton";
import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type DiscographyPageProps = {
  params: Promise<{ artist: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: DiscographyPageProps) {
  const { artist } = await params;

  const token = await convexAuthNextjsToken();
  const artistData = await fetchAction(
    api.pollster.artist.getCachedArtist,
    { artistName: artist },
    { token },
  );

  if (!artistData) redirect("/not-found");

  return {
    title: `${artistData.name} discography | ${SITE_NAME}`,
    description: `View the discography of ${artistData.name} on ${SITE_NAME}.`,
  };
}

async function DiscographyPage(props: DiscographyPageProps) {
  const { artist } = await props.params;
  const { page } = await props.searchParams;

  return (
    <main className="content-wrapper px-5 py-6 xl:px-0">
      <Suspense fallback={<DiscographySkeleton />}>
        <Discography artistName={artist} page={page} />
      </Suspense>
    </main>
  );
}

export default DiscographyPage;
