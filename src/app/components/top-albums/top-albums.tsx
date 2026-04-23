import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import Album from "../album/album";
import ItemGrid from "../layout/item-grid";
import SectionHeader from "../layout/section-header";

type TopAlbumsProps = {
  artistName: string;
};

async function TopAlbums({ artistName }: TopAlbumsProps) {
  const token = await convexAuthNextjsToken();

  const artistData = await fetchAction(
    api.pollster.artist.getCachedArtist,
    { artistName },
    { token },
  );

  if (!artistData) return null;

  const topAlbumsData = await fetchAction(
    api.pollster.artist.getTopAlbums,
    {
      artistName: artistData.name,
      spotifyUrl: artistData.spotifyUrl,
      lastfmUrl: artistData.lastfmUrl,
    },
    { token },
  );

  if (!topAlbumsData)
    return <p>Error getting top albums for {artistData.name}.</p>;

  const imgIndex = !artistData.spotifyUrl ? 3 : 0;

  return (
    <section>
      <SectionHeader
        title="Top Albums"
        action={{
          label: "View Discography",
          href: `/catalog/${artistName}/discography`,
        }}
      />
      <ItemGrid>
        {topAlbumsData.map((album, index) => (
          <Album
            key={index}
            artistName={artistData.name}
            albumData={album}
            imgIndex={imgIndex}
          />
        ))}
      </ItemGrid>
    </section>
  );
}

export default TopAlbums;
