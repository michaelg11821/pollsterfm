import type { Album } from "@/lib/types/lastfm";
import Image from "next/image";

type AlbumResultsProps = {
  results: Album[];
  selectResult: (artist: string, album: string, image: string) => void;
};

function AlbumResults({ results, selectResult }: AlbumResultsProps) {
  return (
    <>
      {results.map((result, index) => (
        <button
          type="button"
          key={`result-${index}`}
          role="option"
          aria-selected={false}
          aria-label={`Select album ${result.name} by ${result.artist}`}
          className="hover:bg-accent/50 hover:text-accent-foreground focus-visible:ring-ring flex w-full cursor-pointer items-center gap-3 border-b p-3 text-left transition-colors last:border-b-0 focus-visible:outline-none focus-visible:ring-2"
          onClick={() =>
            selectResult(result.artist, result.name, result.image[2]["#text"])
          }
        >
          <div className="bg-muted h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
            {result.image[2]["#text"] !== "" && (
              <Image
                src={result.image[2]["#text"]}
                alt=""
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{result.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              {result.artist}
            </p>
          </div>
        </button>
      ))}
    </>
  );
}

export default AlbumResults;
