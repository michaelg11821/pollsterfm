import { utsToIsoString } from "@/lib/convex-utils";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import { randomUUID } from "crypto";
import Track from "../track/track";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { MAX_TRACKS_WITHOUT_IMPORT } from "./config";

type LastfmListeningHistoryProps = {
  username: string;
  page: number;
};

async function LastfmListeningHistory({
  username,
  page,
}: LastfmListeningHistoryProps) {
  const limit = MAX_TRACKS_WITHOUT_IMPORT;

  const token = await convexAuthNextjsToken();

  const trackData = await fetchAction(
    api.lastfm.user.getRecentlyPlayedTracks,
    {
      username,
      limit,
      page,
    },
    { token },
  );

  if ("error" in trackData) {
    switch (trackData.error) {
      case "PRIVATE_LASTFM_PROFILE":
        return <p>This user&apos;s listening history is private.</p>;
      case "SERVICE_ERROR":
        return <p>Error getting recently played tracks from Last.fm.</p>;
      case "INTERNAL_SERVER_ERROR":
        return (
          <p>Unknown error getting recently played tracks from Last.fm.</p>
        );
    }
  }

  const getVisiblePages = () => {
    const total = Number(trackData.recenttracks["@attr"].totalPages);
    const maxVisible = 5;

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];
    const innerCount = maxVisible - 2;
    const half = Math.floor(innerCount / 2);

    pages.push(1);

    let start = Math.max(2, page - half);
    let end = Math.min(total - 1, page + half);

    if (page <= half + 1) {
      start = 2;
      end = 2 + innerCount - 1;
    } else if (page >= total - half) {
      end = total - 1;
      start = end - innerCount + 1;
    }

    if (start > 2) {
      pages.push("ellipsis");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < total - 1) {
      pages.push("ellipsis");
    }

    pages.push(total);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="my-3">
      {trackData.recenttracks.track.map((track) => (
        <Track
          key={randomUUID()}
          name={track.name}
          image={track.image[1]["#text"]}
          artists={[track.artist["#text"]]}
          albumName={track.album["#text"]}
          playedAt={utsToIsoString(track.date!.uts)}
        />
      ))}

      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  page > 1 ? `/user/${username}/history?page=${page - 1}` : "#"
                }
                className={page > 1 ? "" : "pointer-events-none opacity-50"}
              />
            </PaginationItem>

            {visiblePages &&
              visiblePages.map((page, i) => {
                if (page === "ellipsis") {
                  return (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={`page-${page}`}>
                    <PaginationLink
                      href={`/user/${username}/history?page=${page as number}`}
                      isActive={page === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

            <PaginationItem>
              <PaginationNext
                href={`/user/${username}/history?page=${page + 1}`}
                className={
                  page === Number(trackData.recenttracks["@attr"].totalPages)
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default LastfmListeningHistory;
