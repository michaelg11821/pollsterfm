import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import Link from "next/link";
import Album from "../album/album";
import { buttonVariants } from "../ui/button";

type TopAlbumsProps = {
  artistName: string;
};

async function TopAlbums({ artistName }: TopAlbumsProps) {
  const token = await convexAuthNextjsToken();

  const artistData = await fetchAction(
    api.pollster.artist.findFirstByName,
    { artistName },
    { token },
  );

  if (!artistData) return null;

  const topAlbumsData = await fetchAction(
    api.pollster.artist.getTopAlbums,
    {
      artistName,
      spotifyUrl: artistData.spotifyUrl,
      lastfmUrl: artistData.lastfmUrl,
    },
    { token },
  );

  if (!topAlbumsData)
    return <p>Error getting top albums for {artistData.name}.</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Top Albums</h2>
        <Link
          href={`/catalog/${artistName}/discography`}
          className={buttonVariants({ variant: "outline" })}
        >
          View Discography
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {topAlbumsData.map((album, index) => (
          <Album key={index} artistName={artistData.name} albumData={album} />
        ))}
      </div>
    </div>
  );
}

export default TopAlbums;
