"use client";

import { useEffect } from "react";
import { noGenresMsg } from "../config";

import type { TrackData } from "@/lib/types/internalResponses";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../../ui/card";

type ClientTrackGenresProps = {
  trackData: TrackData;
};

function ClientTrackGenres({ trackData }: ClientTrackGenresProps) {
  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `/catalog/${encodeURIComponent(trackData.artists[0])}/discography/${encodeURIComponent(trackData.albumName)}/${encodeURIComponent(trackData.name)}/genres`,
    );
  }, [trackData.artists, trackData.name, trackData.albumName]);

  if (!trackData.genres) return null;

  const genres = trackData.genres.map((genre, i) => (
    <div
      key={i}
      className="bg-accent hover:bg-accent-foreground/10 flex items-center justify-between rounded-sm border p-3 transition-[background-color]"
    >
      <span>{typeof genre === "string" ? genre : genre.name}</span>
    </div>
  ));

  return (
    <>
      <Link
        href={`/catalog/${encodeURIComponent(trackData.artists[0])}/discography/${encodeURIComponent(trackData.albumName)}/${encodeURIComponent(trackData.name)}`}
        className="text-primary hover:text-ring/50 mb-6 inline-flex items-center text-sm no-underline transition-[color]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to track
      </Link>
      <div className="mb-8 flex items-center gap-6">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl shadow-md/20 dark:shadow-none">
          {trackData.image && (
            <Image
              src={trackData.image}
              alt={trackData.name}
              width={224}
              height={224}
              className="h-full w-full object-cover"
              priority
            />
          )}
        </div>
        <div>
          <h1 className="m-0 text-3xl font-bold">{trackData.name}</h1>
          <p className="text-muted-foreground m-0 text-lg">All Genres</p>
        </div>
      </div>
      {genres.length > 0 ? (
        <div className="grid gap-6">
          <Card className="py-4">
            <CardContent>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {genres}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <p>{noGenresMsg}</p>
      )}
    </>
  );
}

export default ClientTrackGenres;
