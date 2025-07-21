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
        <div
          key={`result-${index}`}
          className="hover:bg-accent/50 hover:text-accent-foreground flex cursor-pointer items-center gap-3 border-b p-3 transition-colors last:border-b-0"
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
        </div>
      ))}
    </>
  );
}

export default AlbumResults;
