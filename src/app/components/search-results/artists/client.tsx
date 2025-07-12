"use client";

import { Artist } from "@/lib/types/spotify";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

type ClientArtistResultsProps = {
  artists: Artist[];
};

function ClientArtistResults({ artists }: ClientArtistResultsProps) {
  const artistsScrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (!artistsScrollRef.current) return;

    artistsScrollRef.current.scrollBy({ left: -450, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!artistsScrollRef.current) return;

    artistsScrollRef.current.scrollBy({ left: 450, behavior: "smooth" });
  };

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center text-2xl font-bold">
          <User className="mr-3 h-6 w-6" />
          Artists
        </h2>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-10 w-10 cursor-pointer rounded-full p-0"
            onClick={() => scrollLeft()}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            size="sm"
            className="h-10 w-10 cursor-pointer rounded-full p-0"
            variant="outline"
            onClick={() => scrollRight()}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        ref={artistsScrollRef}
        className="flex gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/catalog/${encodeURIComponent(artist.name)}`}
          >
            <Card className="hover:bg-foreground/10 flex max-w-80 min-w-50 cursor-pointer items-center gap-3 p-4 transition-[background-color]">
              <div className="bg-muted relative h-20 w-20 overflow-hidden rounded-full">
                {artist.images[0] && (
                  <Image
                    src={artist.images[0].url}
                    alt={artist.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <h3 className="mb-1 max-w-50 truncate text-lg font-semibold">
                {artist.name}
              </h3>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ClientArtistResults;
