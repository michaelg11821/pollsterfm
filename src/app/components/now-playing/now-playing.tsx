import { randomUUID } from "crypto";

import Image from "next/image";

import Reactions from "../reactions/reactions";

import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import Link from "next/link";
import { Badge } from "../ui/badge";
import NowPlayingSkeleton from "./skeleton";

type NowPlayingProps = {
  username: string;
};

async function NowPlaying({ username }: NowPlayingProps) {
  const token = await convexAuthNextjsToken();

  const currentlyPlaying = await fetchAction(
    api.user.getCurrentlyPlayingTrack,
    { username },
    { token },
  );

  if (currentlyPlaying === undefined) return <NowPlayingSkeleton />;

  if (currentlyPlaying === null || "error" in currentlyPlaying) return null;

  const mainArtist = currentlyPlaying.artists[0];
  const albumName = currentlyPlaying.albumName;
  const trackName = currentlyPlaying.name;

  return (
    <div className="mb-6 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center">
      <div className="relative mx-auto my-0 h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:m-0 sm:h-18 sm:w-18">
        <Image src={currentlyPlaying.image} alt="" fill sizes="100%" priority />
      </div>
      <div className="mt-3 flex-1 text-center sm:mt-0 sm:text-left">
        <div className="mb-1 flex flex-wrap justify-center gap-2 sm:justify-start">
          <Badge variant="default">Now Playing</Badge>
        </div>
        <Link
          href={`/catalog/${encodeURIComponent(mainArtist)}/discography/${encodeURIComponent(albumName)}/${encodeURIComponent(trackName)}`}
          className="overflow-hidden font-bold overflow-ellipsis whitespace-nowrap"
        >
          {trackName}
        </Link>
        <p className="flex justify-center gap-1 sm:justify-start">
          {currentlyPlaying.artists.map((artist, index) => {
            if (index !== currentlyPlaying.artists.length - 1) {
              return (
                <Link
                  key={randomUUID()}
                  href={`/catalog/${encodeURIComponent(artist)}`}
                  className="text-muted-foreground overflow-hidden text-sm overflow-ellipsis whitespace-nowrap"
                >
                  {artist},{" "}
                </Link>
              );
            }

            return (
              <Link
                key={randomUUID()}
                href={`/catalog/${encodeURIComponent(artist)}`}
                className="text-muted-foreground overflow-hidden text-sm overflow-ellipsis whitespace-nowrap"
              >
                {artist}
              </Link>
            );
          })}{" "}
          <Link
            href={`/catalog/${encodeURIComponent(mainArtist)}/discography/${encodeURIComponent(albumName)}`}
            className="text-muted-foreground overflow-hidden text-sm overflow-ellipsis whitespace-nowrap"
          >
            {" "}
            • {albumName}
          </Link>
        </p>
      </div>
      <Reactions username={username} />
    </div>
  );
}

export default NowPlaying;
