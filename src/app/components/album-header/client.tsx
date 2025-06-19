"use client";

import { useEffect } from "react";

import type { AlbumData } from "@/lib/types/internalResponses";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import TopGenres from "../top-genres/top-genres";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";

type ClientAlbumHeaderProps = {
  artistName: string;
  albumData: AlbumData;
};

function ClientAlbumHeader({ artistName, albumData }: ClientAlbumHeaderProps) {
  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `/catalog/${encodeURIComponent(artistName)}/discography/${encodeURIComponent(albumData.name)}`,
    );
  }, [artistName, albumData.name]);

  return (
    <div className="content-wrapper px-5 py-0 xl:p-0">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="mx-auto h-48 w-48 shrink-0 overflow-hidden rounded-lg shadow-xl md:mx-0 md:h-64 md:w-64">
          {albumData.image && (
            <Image
              src={albumData.image}
              alt={albumData.name}
              width={224}
              height={224}
              className="h-full w-full object-cover"
              priority
            />
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
                <Badge className="bg-primary/20 text-primary" variant="default">
                  Album
                </Badge>
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">
                {albumData.name}
              </h1>
              <div className="mt-1">
                <Link
                  href={`/catalog/${encodeURIComponent(artistName)}/`}
                  className="text-primary inline-block text-xl no-underline transition-[color] hover:underline"
                >
                  {decodeURIComponent(artistName)}
                </Link>
              </div>

              <div className="mt-4 flex items-center justify-center gap-3 md:justify-start">
                {/* <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(albumData.rating)
                              ? "text-[#8A4FFF] fill-[#8A4FFF]"
                              : i < albumData.rating
                                ? "text-[#8A4FFF] fill-[#8A4FFF]/50"
                                : "text-white/20"
                          }`}
                        />
                      ))}
                      <span className="font-medium ml-2">{albumData.rating}</span>
                      <span className="text-white/60 text-sm ml-1">({albumData.ratingsCount.toLocaleString()})</span>
                    </div> */}
              </div>

              <div className="flex items-center gap-3">
                {albumData.spotifyUrl && (
                  <Link
                    href={albumData.spotifyUrl}
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-1.5 text-sm no-underline transition-[color]"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    Spotify
                  </Link>
                )}
                {albumData.lastfmUrl && (
                  <Link
                    href={albumData.lastfmUrl}
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-1.5 text-sm no-underline transition-[color]"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M10.584 17.21l-.88-2.392s-1.43 1.594-3.573 1.594c-1.897 0-3.244-1.649-3.244-4.288 0-3.382 1.704-4.591 3.381-4.591 2.42 0 3.189 1.567 3.849 3.574l.88 2.749c.88 2.666 2.529 4.81 7.285 4.81 3.409 0 5.718-1.044 5.718-3.793 0-2.227-1.265-3.381-3.63-3.931l-1.758-.385c-1.21-.275-1.567-.77-1.567-1.595 0-.934.742-1.484 1.952-1.484 1.32 0 2.034.495 2.144 1.677l2.749-.33c-.22-2.474-1.924-3.492-4.729-3.492-2.474 0-4.893.935-4.893 3.932 0 1.87.907 3.051 3.189 3.601l1.87.44c1.402.33 1.869.907 1.869 1.704 0 1.017-.99 1.43-2.86 1.43-2.776 0-3.93-1.457-4.59-3.464l-.907-2.75c-1.155-3.573-2.997-4.893-6.653-4.893C2.144 5.333 0 7.89 0 12.233c0 4.18 2.144 6.434 5.993 6.434 3.106 0 4.591-1.457 4.591-1.457z" />
                    </svg>
                    Last.fm
                  </Link>
                )}
              </div>

              <TopGenres
                genres={albumData.genres}
                pollsterUrl={`/catalog/${encodeURIComponent(artistName)}/${encodeURIComponent(albumData.name)}/genres`}
              />
            </div>
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-primary self-center md:self-end",
              )}
            >
              Create Poll
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientAlbumHeader;
