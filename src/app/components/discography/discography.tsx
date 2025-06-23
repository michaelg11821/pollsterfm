import { findFirstArtistByName, getAlbums } from "@/lib/pollster/artist";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Album from "../album/album";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import ClientDiscography from "./client";

type DiscographyProps = {
  artistName: string;
  page: string | undefined;
};

async function Discography({ artistName, page = "1" }: DiscographyProps) {
  const artistData = await findFirstArtistByName(artistName);

  if (!artistData) redirect("/not-found");

  const currentPage = Number(page);

  const albumData = await getAlbums(artistData, currentPage);

  if (!albumData) return redirect("/not-found");

  const getVisiblePages = () => {
    const total = albumData.totalPages;
    const maxVisible = 5;

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];
    const innerCount = maxVisible - 2;
    const half = Math.floor(innerCount / 2);

    pages.push(1);

    let start = Math.max(2, currentPage - half);
    let end = Math.min(total - 1, currentPage + half);

    if (currentPage <= half + 1) {
      start = 2;
      end = 2 + innerCount - 1;
    } else if (currentPage >= total - half) {
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
    <>
      <Link
        href={`/catalog/${encodeURIComponent(artistData.name)}`}
        className="text-primary hover:text-ring/50 mb-6 inline-flex items-center text-sm no-underline transition-[color]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to artist
      </Link>

      <div className="mb-8 flex items-center gap-6">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl shadow-md/20 dark:shadow-none">
          {artistData.image && (
            <Image
              src={artistData.image}
              alt=""
              width={224}
              height={224}
              className="h-full w-full object-cover"
              priority
            />
          )}
        </div>
        <div>
          <h1 className="m-0 text-3xl font-bold">{artistData.name}</h1>
          <p className="text-muted-foreground m-0 text-lg">Discography</p>
        </div>
      </div>

      {albumData ? (
        <div className="mt-0">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {albumData.albums.map((album, i) => (
              <Album
                key={i}
                artistName={artistData.name}
                albumData={album}
                imgIndex={2}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={
                      currentPage > 1
                        ? `/catalog/${artistData.name}/discography?page=${currentPage - 1}`
                        : "#"
                    }
                    className={
                      currentPage > 1 ? "" : "pointer-events-none opacity-50"
                    }
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
                          href={`/catalog/${artistData.name}/discography?page=${page as number}`}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                <PaginationItem>
                  <PaginationNext
                    href={`/catalog/${artistData.name}/discography?page=${currentPage + 1}`}
                    className={
                      currentPage === albumData.totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <ClientDiscography artistName={artistData.name} />
        </div>
      ) : (
        <p>Error getting discography.</p>
      )}
    </>
  );
}

export default Discography;
