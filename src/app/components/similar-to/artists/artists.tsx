import {
  findFirstArtistByName,
  getSimilarArtists,
} from "@/lib/pollster/artist";
import Link from "next/link";
import { Badge } from "../../ui/badge";

type SimilarArtistsProps = {
  artistName: string;
};

async function SimilarArtists({ artistName }: SimilarArtistsProps) {
  const artistData = await findFirstArtistByName(artistName);

  if (!artistData) return <p>Error. Please refresh the page.</p>;

  const similarArtists = await getSimilarArtists(artistData, 4);

  if (!similarArtists) return <p>Error. Please refresh the page.</p>;

  return (
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
  );
}

export default SimilarArtists;
