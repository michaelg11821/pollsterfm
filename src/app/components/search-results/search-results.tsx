import { Suspense } from "react";
import AlbumResults from "./albums/albums";
import AlbumResultsSkeleton from "./albums/skeleton";
import ArtistResults from "./artists/artists";
import ArtistResultsSkeleton from "./artists/skeleton";

type SearchResultsProps = {
  query: string;
};

async function SearchResults({ query }: SearchResultsProps) {
  return (
    <div className="space-y-12">
      <h2 className="text-2xl">Results for {`"${query}"`}</h2>
      <Suspense fallback={<ArtistResultsSkeleton />}>
        <ArtistResults query={query} />
      </Suspense>
      <Suspense fallback={<AlbumResultsSkeleton />}>
        <AlbumResults query={query} />
      </Suspense>
      {/*
                  Albums
                  {filteredResults.albums.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Music className="h-6 w-6 mr-3 text-rose-400" />
                        Albums
                        <span className="ml-3 text-sm font-normal text-white/50">
                          ({filteredResults.albums.length} results)
                        </span>
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredResults.albums.map((album) => (
                          <Card
                            key={album.id}
                            className="bg-white/5 backdrop-blur-md border border-white/10 p-4 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                          >
                            <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-white/10 relative">
                              <Image
                                src={album.image || "/placeholder.svg"}
                                alt={album.name}
                                width={300}
                                height={300}
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button size="sm" className="bg-rose-500 hover:bg-rose-600 rounded-full h-12 w-12 p-0">
                                  <Play className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                            <h3 className="font-medium text-white mb-1 line-clamp-1">{album.name}</h3>
                            <p className="text-rose-300/70 text-sm line-clamp-1 mb-2">{album.artist}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-rose-300/60 text-xs">{formatDate(album.release_date)}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-rose-300/60 hover:text-rose-300"
                                asChild
                              >
                                <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </section>
                  )}


                  {filteredResults.tracks.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <BarChart className="h-6 w-6 mr-3 text-rose-400" />
                        Tracks
                        <span className="ml-3 text-sm font-normal text-white/50">
                          ({filteredResults.tracks.length} results)
                        </span>
                      </h2>
                      <div className="space-y-3">
                        {filteredResults.tracks.map((track, index) => (
                          <Card
                            key={track.id}
                            className="bg-white/5 backdrop-blur-md border border-white/10 p-4 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-rose-300/60 text-sm w-8 text-center">{index + 1}</span>
                              <div className="h-12 w-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 relative">
                                <Image
                                  src={track.image || "/placeholder.svg"}
                                  alt={track.album}
                                  width={48}
                                  height={48}
                                  className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Play className="h-3 w-3 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white mb-1 line-clamp-1">{track.name}</h3>
                                <p className="text-rose-300/70 text-sm line-clamp-1">
                                  {track.artist} • {track.album}
                                </p>
                              </div>
                              <div className="flex items-center gap-6 text-rose-300/60">
                                <span className="flex items-center gap-1 text-sm">
                                  <TrendingUp className="h-4 w-4" />
                                  {track.popularity}%
                                </span>
                                <span className="flex items-center gap-1 text-sm">
                                  <Clock className="h-4 w-4" />
                                  {formatDuration(track.duration_ms)}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-rose-300/60 hover:text-rose-300"
                                  asChild
                                >
                                  <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                  
                      </div>
                    </section>
                  )}
                    */}
    </div>
  );
}

export default SearchResults;
