"use client";

import type { Album as LastfmAlbum } from "@/lib/types/lastfm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import Album from "../../album/album";
import { Button } from "../../ui/button";

type ClientAlbumResultsProps = {
  albums: LastfmAlbum[];
};

function ClientAlbumResults({ albums }: ClientAlbumResultsProps) {
  const albumsScrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (!albumsScrollRef.current) return;

    albumsScrollRef.current.scrollBy({ left: -450, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!albumsScrollRef.current) return;

    albumsScrollRef.current.scrollBy({ left: 450, behavior: "smooth" });
  };

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center text-2xl font-bold">Albums</h2>
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

      <div className="scroll-gradient relative">
        <div
          ref={albumsScrollRef}
          className="flex gap-6 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {albums.map((album) => (
            <Album
              key={album.url}
              className="max-w-50 min-w-50"
              artistName={album.artist}
              albumData={{
                name: album.name,
                images: album.image.map((img) => {
                  return { url: img["#text"] };
                }),
                releaseDate: null,
              }}
              imgIndex={2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ClientAlbumResults;
