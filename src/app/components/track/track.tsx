import { dateStringDistanceToNow, msToDuration } from "@/lib/convex-utils";

import Image from "next/image";
import Link from "next/link";

type TrackProps = {
  name: string;
  image: string;
  artists: string[];
  albumName: string;
  /**
   * A string in the ISO 8601 format.
   */
  playedAt?: string;
  duration?: number;
};

function Track({
  name,
  image,
  artists,
  albumName,
  playedAt,
  duration,
}: TrackProps) {
  return (
    <Link
      className="hover:bg-foreground/10 flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-[background-color]"
      href={`/catalog/${encodeURIComponent(artists[0])}/discography/${encodeURIComponent(albumName)}/${encodeURIComponent(name)}`}
    >
      <div className="relative z-0 h-10 w-10 shrink-0 overflow-hidden rounded-sm">
        <Image src={image} alt="" fill sizes="100%" priority />
      </div>
      <div className="flex min-w-0 flex-1 flex-col text-xs select-none">
        <h4 className="overflow-hidden text-sm font-medium overflow-ellipsis whitespace-nowrap">
          {name}
        </h4>
        <p className="flex gap-1">
          {artists.map((name, index) => {
            if (index !== artists.length - 1) {
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
            • {albumName}
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
