"use client";

import { cn } from "@/lib/next-utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonVariants } from "../ui/button";

type HomepageSearchProps = {
  initialQuery: string | undefined;
};

function HomepageSearch({ initialQuery }: HomepageSearchProps) {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(
    initialQuery,
  );

  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        return router.push(
          `/search?query=${encodeURIComponent(searchQuery ?? "")}`,
        );
      }}
    >
      <div className="hidden md:relative md:mx-auto md:mb-20 md:block md:max-w-168">
        <div className="bg-foreground/10 hover:border-muted-foreground/40 border-muted-foreground/20 focus-within:ring-foreground/60 flex items-center rounded-full border-2 p-2 pl-6 transition-[border-color] focus-within:ring-2">
          <Search className="mr-3 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for music, affinities, or people..."
            className="placeholder:text-muted-foreground flex-1 border-none bg-transparent outline-none"
            defaultValue={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            name="searchQuery"
          />

          <Link
            href={`/search?query=${encodeURIComponent(searchQuery ?? "")}`}
            className={cn(
              buttonVariants({
                variant: "default",
                size: "lg",
              }),
              "bg-primary h-12 cursor-pointer rounded-full px-6",
            )}
          >
            Search
          </Link>
        </div>
      </div>
    </form>
  );
}

export default HomepageSearch;
