"use client";

import type { Tag } from "@/lib/types/lastfm";

import { useEffect } from "react";
import { noGenresMsg } from "./config";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";

type ArtistData = {
  name: string;
  image: string | null;
  genres: string[] | Tag[] | null;
};

type ClientGenresProps = {
  itemData: ArtistData; // | AlbumData and so on...
  category: "artist" | "album" | "track";
};

function ClientGenres({ itemData, category }: ClientGenresProps) {
  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `/catalog/${encodeURIComponent(itemData.name)}/genres`,
    );
  }, [itemData.name]);

  if (!itemData.genres) return null;

  const genres = itemData.genres.map((genre, i) => (
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
        href={`/catalog/${encodeURIComponent(itemData.name)}`}
        className="text-primary hover:text-ring/50 mb-6 inline-flex items-center text-sm no-underline transition-[color]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to {category}
      </Link>
      <div className="mb-8 flex items-center gap-6">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl shadow-md/20 dark:shadow-none">
          {itemData.image && (
            <Image
              src={itemData.image}
              alt={itemData.name}
              width={224}
              height={224}
              className="h-full w-full object-cover"
              priority
            />
          )}
        </div>
        <div>
          <h1 className="m-0 text-3xl font-bold">{itemData.name}</h1>
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

export default ClientGenres;
