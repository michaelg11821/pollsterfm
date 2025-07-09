"use client";

import { useState } from "react";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../../ui/dialog";

type MobileSearchProps = {
  initialQuery: string | null;
};

function MobileSearch({ initialQuery }: MobileSearchProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(initialQuery);

  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <div className="md:hidden">
            <button
              type="button"
              className="hover:bg-accent mr-2.5 flex h-10 w-10 cursor-pointer flex-col items-center justify-center rounded-lg border-none bg-inherit p-1.5 transition-[background-color]"
              aria-label={`${open ? "Close" : "Open"} search`}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        }
      />
      <DialogContent className="w-full">
        <div className="bg-background mt-5 flex w-full flex-col gap-2 rounded-lg">
          <DialogClose
            render={
              <button
                className="text-muted-foreground hover:text-foreground absolute top-2 right-2 p-1"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            }
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();

              return router.push(
                `/search?query=${encodeURIComponent(searchQuery ?? "")}`,
              );
            }}
          >
            <div className="bg-foreground/10 hover:border-muted-foreground/40 border-muted-foreground/20 focus-within:ring-foreground/60 flex w-full items-center rounded-full border-1 p-1.5 pl-4 transition-[border-color] focus-within:ring-1">
              <input
                type="text"
                placeholder="Search"
                defaultValue={searchQuery ?? ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="placeholder:text-muted-foreground flex-1 border-none bg-transparent text-sm outline-none"
                name="searchQuery"
                autoFocus
              />
              <Link
                href={`/search?query=${encodeURIComponent(searchQuery ?? "")}`}
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                  className:
                    "focus-visible:ring-foreground/60 h-6 w-6 cursor-pointer hover:bg-transparent",
                })}
              >
                <Search className="h-5 w-5" />
              </Link>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MobileSearch;
