import { randomUUID } from "crypto";

import { getCurrentlyPlayingTrack } from "@/lib/data-access/user/spotify";

import Image from "next/image";

import Reactions from "../reactions/reactions";

import { getName } from "@/lib/data-access/user/read";
import { Badge } from "../ui/badge";

type NowPlayingProps = {
  username: string;
};

async function NowPlaying({ username }: NowPlayingProps) {
  const currentlyPlaying = await getCurrentlyPlayingTrack(username);

  if (!currentlyPlaying || !currentlyPlaying.item) return null;

  if (currentlyPlaying.item.is_local) return null;

  const name = await getName(username);

  return (
    <div className="mb-6 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center">
      <div className="relative mx-auto my-0 h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:m-0 sm:h-18 sm:w-18">
        <Image
          src={currentlyPlaying.item.album.images[0].url}
          alt=""
          fill
          sizes="100%"
          priority
        />
      </div>
      <div className="mt-3 flex-1 text-center sm:mt-0 sm:text-left">
        <div className="mb-1 flex flex-wrap justify-center gap-2 sm:justify-start">
          <Badge className="bg-primary/20 text-primary" variant="default">
            Now Playing
          </Badge>
        </div>
        <h3 className="overflow-hidden font-bold overflow-ellipsis whitespace-nowrap">
          {currentlyPlaying.item.name}
        </h3>
        <p className="flex justify-center gap-1 sm:justify-start">
          {currentlyPlaying.item.album.artists.map(({ name }, index) => {
            if (index !== currentlyPlaying.item!.album.artists.length - 1) {
              return (
                <span
                  key={randomUUID()}
                  className="text-muted-foreground overflow-hidden text-sm overflow-ellipsis whitespace-nowrap"
                >
                  {name},{" "}
                </span>
              );
            }

            return (
              <span
                key={randomUUID()}
                className="text-muted-foreground overflow-hidden text-sm overflow-ellipsis whitespace-nowrap"
              >
                {name}
              </span>
            );
          })}{" "}
          <span className="text-muted-foreground overflow-hidden text-sm overflow-ellipsis whitespace-nowrap">
            {" "}
            • {currentlyPlaying.item.album.name}
          </span>
        </p>
      </div>
      <Reactions username={username} name={name} />
    </div>
  );
}

export default NowPlaying;
