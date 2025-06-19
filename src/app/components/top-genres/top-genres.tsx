import type { PollsterGenres } from "@/lib/types/pollster";
import Link from "next/link";
import { Badge } from "../ui/badge";

type TopGenresProps = {
  genres: PollsterGenres;
  pollsterUrl: string;
};

function TopGenres({ genres, pollsterUrl }: TopGenresProps) {
  const asJsx = genres?.slice(0, 5).map((genre, i) => (
    <Badge key={i} variant="outline" className="select-none">
      {typeof genre === "string" ? genre : genre.name}
    </Badge>
  ));

  return (
    <>
      {asJsx && asJsx.length > 0 ? (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 md:justify-start">
          {asJsx}{" "}
          {genres!.length > 5 && (
            <>
              ...
              <Link
                href={pollsterUrl}
                className="text-primary inline-block text-sm no-underline transition-[color] hover:underline"
              >
                more
              </Link>{" "}
            </>
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default TopGenres;
