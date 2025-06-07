import Image from "next/image";
import Link from "next/link";

import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const similarArtists = [
  {
    id: "thom-yorke",
    name: "Thom Yorke",
    image: null,
    match: 94,
  },
  {
    id: "arcade-fire",
    name: "Arcade Fire",
    image: null,
    match: 86,
  },
  {
    id: "the-national",
    name: "The National",
    image: null,
    match: 82,
  },
  {
    id: "bjork",
    name: "Björk",
    image: null,
    match: 79,
  },
];

type SimilarToProps = {
  category: "artist" | "album" | "track";
  itemName: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SimilarTo({ category, itemName }: SimilarToProps) {
  // use spotify search to find similar artists
  // artist.getSimilar on last fm to find similar artists
  const firstLetterCap = category.charAt(0).toUpperCase();
  const upperCategory = firstLetterCap + category.slice(1);

  return (
    <Card>
      <CardHeader className="mb-0 flex items-center justify-between">
        <CardTitle className="text-xl font-bold">
          Similar {upperCategory}s
        </CardTitle>
        <Link href="#" className={buttonVariants({ variant: "ghost" })}>
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {similarArtists.map((artist) => (
            <Link
              href={`/catalog/${encodeURIComponent(artist.name)}`}
              key={artist.id}
              className="hover:bg-foreground/10 -mr-2 -ml-2 flex items-center gap-3 rounded-xl p-2 no-underline transition-[background-color]"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm">
                {artist.image ? (
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    width={48}
                    height={48}
                    className="block h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div>
                <p className="m-0">{artist.name}</p>
                <Badge className="bg-primary/20 text-primary" variant="default">
                  {artist.match}% match
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default SimilarTo;
