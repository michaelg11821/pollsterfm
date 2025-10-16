"use client";

import { cn } from "@/lib/next-utils";
import type { CatalogItemType } from "@/lib/types/pollster";
import Image from "next/image";

type CatalogImageProps = {
  image?: string | null;
  alt: string;
  itemType: CatalogItemType;
};

function CatalogImage({ image, alt, itemType }: CatalogImageProps) {
  const isArtist = itemType === "artist";

  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden shadow-lg/30 dark:shadow-none",
        isArtist
          ? "h-40 w-40 self-center rounded-xl md:h-56 md:w-56 md:self-start"
          : "mx-auto h-48 w-48 rounded-lg shadow-xl md:mx-0 md:h-64 md:w-64",
      )}
    >
      {image && (
        <Image
          src={image}
          alt={alt}
          width={224}
          height={224}
          className="h-full w-full object-cover"
          priority
        />
      )}
    </div>
  );
}

export default CatalogImage;
