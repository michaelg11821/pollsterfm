import type { Artist } from "@/lib/types/spotify";
import Image from "next/image";

type ArtistResultsProps = {
  results: Artist[];
  selectResult: (artist: string, image: string) => void;
};

function ArtistResults({ results, selectResult }: ArtistResultsProps) {
  return (
    <>
      {results.map((result, index) => (
        <div
          key={`result-${index}`}
          className="hover:bg-accent/50 hover:text-accent-foreground flex cursor-pointer items-center gap-3 border-b p-3 transition-colors last:border-b-0"
          onClick={() =>
            selectResult(
              result.name,
              result.images[0] ? result.images[0].url : "",
            )
          }
        >
          <div className="bg-muted h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
            {result.images[0] && (
              <Image
                src={result.images[0].url}
                alt=""
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{result.name}</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default ArtistResults;
