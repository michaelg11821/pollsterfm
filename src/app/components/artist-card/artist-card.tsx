import { cn } from "@/lib/next-utils";
import Image from "next/image";
import Link from "next/link";

type ArtistCardProps = {
  artist: string;
  image: string;
  className?: string;
};

function ArtistCard({ artist, image, className }: ArtistCardProps) {
  return (
    <Link
      href={`/catalog/${encodeURIComponent(artist)}`}
      className={cn(
        "bg-card hover:bg-accent block rounded-xl border p-4 no-underline shadow-md transition-all hover:transform-[scale(1.02)] dark:shadow-none",
        className,
      )}
    >
      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-full">
        {image !== "" && (
          <Image
            src={image}
            alt={artist}
            fill
            sizes="100%"
            className="object-cover"
          />
        )}
      </div>
      <h3 className="m-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
        {artist}
      </h3>
    </Link>
  );
}

export default ArtistCard;
