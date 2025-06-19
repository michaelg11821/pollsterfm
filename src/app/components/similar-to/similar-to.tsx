import Link from "next/link";

import { buttonVariants } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import SimilarArtists from "./artists/artists";

type SimilarToProps =
  | {
      category: "artist";
      artistName: string;
    }
  | {
      category: "album";
      artistName: string;
      albumName: string;
    }
  | {
      category: "track";
      artistName: string;
      albumName: string;
      trackName: string;
    };

async function SimilarTo(props: SimilarToProps) {
  const firstLetterCap = props.category.charAt(0).toUpperCase();
  const upperCategory = firstLetterCap + props.category.slice(1);

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
        {props.category === "artist" ? (
          <SimilarArtists artistName={props.artistName} />
        ) : null}
      </CardContent>
    </Card>
  );
}

export default SimilarTo;
