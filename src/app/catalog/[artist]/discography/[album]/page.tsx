import AlbumTracks from "@/app/components/album-tracks/album-tracks";
import AlbumTracksSkeleton from "@/app/components/album-tracks/skeleton";
import CatalogHeader from "@/app/components/catalog-header/catalog-header";
import CatalogHeaderSkeleton from "@/app/components/catalog-header/skeleton";
import FeaturedIn from "@/app/components/featured-in/featured-in";
import TopListeners from "@/app/components/top-listeners/top-listeners";
import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import { redirect } from "next/navigation";
// import Link from "next/link";
import { Suspense } from "react";

type AlbumPageProps = {
  params: Promise<{ artist: string; album: string }>;
};

export async function generateMetadata({ params }: AlbumPageProps) {
  const { artist, album } = await params;

  const token = await convexAuthNextjsToken();

  const artistData = await fetchAction(
    api.pollster.artist.getCachedArtist,
    { artistName: artist },
    { token },
  );

  if (!artistData) redirect("/not-found");

  const albumData = await fetchAction(
    api.pollster.album.getCachedAlbum,
    { artistName: artistData.name, albumName: album },
    { token },
  );

  if (!albumData) redirect("/not-found");

  return {
    title: `${albumData.name} — ${artistData.name} | ${SITE_NAME}`,
    description: `Find more about ${albumData.name} by ${artistData.name} on ${SITE_NAME}.`,
  };
}

async function AlbumPage({ params }: AlbumPageProps) {
  const { artist, album } = await params;

  return (
    <main className="px-0 py-8">
      <Suspense fallback={<CatalogHeaderSkeleton itemType="album" />}>
        <CatalogHeader itemType="album" artistName={artist} albumName={album} />
      </Suspense>
      <div className="content-wrapper mt-10 px-5 py-0 xl:p-0">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="space-y-10 lg:col-span-3">
            <Suspense fallback={<AlbumTracksSkeleton />}>
              <AlbumTracks artistName={artist} albumName={album} />
            </Suspense>
            <TopListeners category="album" itemName={album} />
            <FeaturedIn
              category="album"
              artistName={artist}
              albumName={album}
            />
            {/* make into component "album-reviews" */}
            {/* <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <Button className="bg-[#8A4FFF] hover:bg-[#7A3FEE]">Write Review</Button>
              </div>

              <div className="space-y-6">
                {albumData.reviews.map((review, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.userImage || "/placeholder.svg"} />
                        <AvatarFallback>{review.user.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">@{review.user}</span>
                            <span className="text-white/60 text-sm ml-2">{review.date}</span>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, j) => (
                              <Star
                                key={j}
                                className={`h-4 w-4 ${
                                  j < Math.floor(review.rating)
                                    ? "text-[#8A4FFF] fill-[#8A4FFF]"
                                    : j < review.rating
                                      ? "text-[#8A4FFF] fill-[#8A4FFF]/50"
                                      : "text-white/20"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="mt-2 text-white/80">{review.text}</p>

                        <div className="mt-3 flex items-center gap-4 text-white/60">
                          <button className="flex items-center gap-1 hover:text-white transition-colors">
                            <Heart className="h-4 w-4" />
                            <span className="text-sm">{review.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-white transition-colors">
                            <span className="text-sm">{review.replies} replies</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white">View All Reviews</Button>
            </section> */}
          </div>
        </div>
      </div>
    </main>
  );
}

export default AlbumPage;
