import Album from "@/app/components/album/album";
import ArtistCard from "@/app/components/artist-card/artist-card";
import EmptyState from "@/app/components/layout/empty-state";
import ItemGrid from "@/app/components/layout/item-grid";
import SectionHeader from "@/app/components/layout/section-header";
import TrackCard from "@/app/components/track-card/track-card";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";

type AffinityItemsProps = {
  affinity: string;
};

async function AffinityItems({ affinity }: AffinityItemsProps) {
  const token = await convexAuthNextjsToken();

  const items = await fetchQuery(
    api.pollster.affinity.getItemsByAffinity,
    { name: affinity },
    { token },
  );

  return (
    <div className="flex flex-col gap-10">
      <section>
        <SectionHeader title="Tracks" count={items.tracks.length} />
        {items.tracks.length === 0 ? (
          <EmptyState message="No tracks yet carry this affinity." />
        ) : (
          <ItemGrid>
            {items.tracks.map((track) => (
              <TrackCard
                key={`${track.artist}|${track.album}|${track.track}`}
                artist={track.artist}
                album={track.album}
                track={track.track}
                image={track.image}
              />
            ))}
          </ItemGrid>
        )}
      </section>

      <section>
        <SectionHeader title="Albums" count={items.albums.length} />
        {items.albums.length === 0 ? (
          <EmptyState message="No albums yet carry this affinity." />
        ) : (
          <ItemGrid>
            {items.albums.map((album) => (
              <Album
                key={`${album.artist}|${album.album}`}
                artistName={album.artist}
                albumData={{
                  name: album.album,
                  images: [{ url: album.image }],
                  releaseDate: null,
                }}
              />
            ))}
          </ItemGrid>
        )}
      </section>

      <section>
        <SectionHeader title="Artists" count={items.artists.length} />
        {items.artists.length === 0 ? (
          <EmptyState message="No artists yet carry this affinity." />
        ) : (
          <ItemGrid>
            {items.artists.map((a) => (
              <ArtistCard key={a.artist} artist={a.artist} image={a.image} />
            ))}
          </ItemGrid>
        )}
      </section>
    </div>
  );
}

export default AffinityItems;
