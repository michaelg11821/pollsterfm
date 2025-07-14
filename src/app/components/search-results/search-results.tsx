import { Suspense } from "react";
import AlbumResults from "./albums/albums";
import AlbumResultsSkeleton from "./albums/skeleton";
import ArtistResults from "./artists/artists";
import ArtistResultsSkeleton from "./artists/skeleton";
import TrackResultsSkeleton from "./tracks/skeleton";
import TrackResults from "./tracks/tracks";

type SearchResultsProps = {
  query: string;
};

async function SearchResults({ query }: SearchResultsProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl">Results for {`"${query}"`}</h2>
      <Suspense fallback={<ArtistResultsSkeleton />}>
        <ArtistResults query={query} />
      </Suspense>
      <Suspense fallback={<AlbumResultsSkeleton />}>
        <AlbumResults query={query} />
      </Suspense>
      <Suspense fallback={<TrackResultsSkeleton />}>
        <TrackResults query={query} />
      </Suspense>
    </div>
  );
}

export default SearchResults;
