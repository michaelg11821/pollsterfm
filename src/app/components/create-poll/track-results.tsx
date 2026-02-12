import type { Track } from "@/lib/types/spotify";
import Image from "next/image";

type TrackResultsProps = {
  results: Track[];
  selectResult: (
    artist: string,
    album: string,
    track: string,
    image: string,
  ) => void;
};

function TrackResults({ results, selectResult }: TrackResultsProps) {
  return (
    <>
      {results.map((result, index) => (
        <button
          type="button"
          key={`result-${index}`}
          role="option"
          aria-selected={false}
          aria-label={`Select track ${result.name} from ${result.album.name} by ${result.album.artists[0].name}`}
          className="hover:bg-accent/50 hover:text-accent-foreground focus-visible:ring-ring flex w-full cursor-pointer items-center gap-3 border-b p-3 text-left transition-colors last:border-b-0 focus-visible:outline-none focus-visible:ring-2"
          onClick={() =>
            selectResult(
              result.album.artists[0].name,
              result.album.name,
              result.name,
              result.album.images[0] ? result.album.images[0].url : "",
            )
          }
        >
          <div className="bg-muted h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
            {result.album.images[0] && (
              <Image
                src={result.album.images[0].url}
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
              {`${result.album.name} • ${result.album.artists[0].name}`}
            </p>
          </div>
        </button>
      ))}
    </>
  );
}

export default TrackResults;
