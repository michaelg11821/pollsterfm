import { dateStringDistanceToNow, msToDuration } from "@/lib/convex-utils";

import type { Album } from "@/lib/types/spotify";

import Image from "next/image";
import Link from "next/link";

type TrackProps = {
  album: Album;
  trackTitle: string;
  /**
   * A string in the ISO 8601 format.
   */
  playedAt?: string;
  duration?: number;
};

function Track({ album, trackTitle, playedAt, duration }: TrackProps) {
  return (
    <Link
      className="hover:bg-foreground/10 flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-[background-color]"
      href={`/catalog/${encodeURIComponent(album.artists[0].name)}/discography/${encodeURIComponent(album.name)}/${encodeURIComponent(trackTitle)}`}
    >
      <div className="relative z-0 h-10 w-10 shrink-0 overflow-hidden rounded-sm">
        <Image src={album.images[0].url} alt="" fill sizes="100%" priority />
      </div>
      <div className="flex min-w-0 flex-1 flex-col text-xs select-none">
        <h4 className="overflow-hidden text-sm font-medium overflow-ellipsis whitespace-nowrap">
          {trackTitle}
        </h4>
        <p className="flex gap-1">
          {album.artists.map(({ name }, index) => {
            if (index !== album.artists.length - 1) {
              return (
                <span
                  key={`${name}-${index}`}
                  className="text-muted-foreground overflow-hidden overflow-ellipsis whitespace-nowrap"
                >
                  {name},{" "}
                </span>
              );
            }

            return (
              <span
                key={`${name}-${index}`}
                className="text-muted-foreground overflow-hidden overflow-ellipsis whitespace-nowrap"
              >
                {name}
              </span>
            );
          })}{" "}
          <span className="text-muted-foreground overflow-hidden overflow-ellipsis whitespace-nowrap">
            {" "}
            • {album.name}
          </span>
        </p>
      </div>
      <div className="text-muted-foreground/50 text-xs">
        {playedAt
          ? dateStringDistanceToNow(playedAt)
          : duration
            ? msToDuration(duration)
            : null}
      </div>
    </Link>
  );
}

export default Track;
