import { cn } from "@/lib/next-utils";
import Image from "next/image";
import Link from "next/link";

type TrackCardProps = {
  artist: string;
  album: string;
  track: string;
  image: string;
  className?: string;
};

function TrackCard({ artist, album, track, image, className }: TrackCardProps) {
  return (
    <Link
      href={`/catalog/${encodeURIComponent(artist)}/discography/${encodeURIComponent(album)}/${encodeURIComponent(track)}`}
      className={cn(
        "bg-card hover:bg-accent block rounded-xl border p-4 no-underline shadow-md transition-all hover:transform-[scale(1.02)] dark:shadow-none",
        className,
      )}
    >
      <div className="relative mb-3 aspect-square w-full rounded-sm">
        {image !== "" && (
          <Image
            src={image}
            alt={track}
            fill
            sizes="100%"
            className="rounded-sm object-cover"
          />
        )}
      </div>
      <h3 className="m-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
        {track}
      </h3>
      <p className="text-muted-foreground mt-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm">
        {artist}
        <span className="text-muted-foreground/60"> · </span>
        {album}
      </p>
    </Link>
  );
}

export default TrackCard;
