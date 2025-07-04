import Link from "next/link";

import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type SimilarArtistsProps = {
  artistName: string;
};

async function SimilarArtists({ artistName }: SimilarArtistsProps) {
  const token = await convexAuthNextjsToken();

  const artistData = await fetchAction(
    api.pollster.artist.findFirstByName,
    { artistName },
    { token },
  );

  if (!artistData) return <p>Error. Please refresh the page.</p>;

  const similarArtists = await fetchAction(api.pollster.artist.getSimilar, {
    limit: 4,
    artistName,
    lastfmUrl: artistData.lastfmUrl,
  });

  if (!similarArtists) return <p>Error. Please refresh the page.</p>;

  if (similarArtists.length === 0) return null;

  return (
    <Card>
      <CardHeader className="mb-0 flex items-center justify-between">
        <CardTitle className="text-xl font-bold">Similar Artists</CardTitle>
        <Link href="#" className={buttonVariants({ variant: "ghost" })}>
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {similarArtists.map((artist, i) => (
            <Link
              href={`/catalog/${encodeURIComponent(artist.name)}`}
              key={i}
              className="hover:bg-foreground/10 -mr-2 -ml-2 flex items-center gap-3 rounded-xl p-2 no-underline transition-[background-color]"
            >
              <div className="bg-background/20 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border">
                <span className="text-lg">
                  {artist.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="m-0">{artist.name}</p>
                <Badge className="bg-primary/20 text-primary" variant="default">
                  {/*  TEMPORARY */}
                  66% match
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default SimilarArtists;
