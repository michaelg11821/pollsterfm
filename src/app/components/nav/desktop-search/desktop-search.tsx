import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonVariants } from "../../ui/button";

type DesktopSearchProps = {
  initialQuery: string | null;
};

function DesktopSearch({ initialQuery }: DesktopSearchProps) {
  const [searchQuery, setSearchQuery] = useState<string | null>(initialQuery);

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
      <div className="mr-5 hidden md:relative md:block">
        <div className="bg-foreground/10 hover:border-muted-foreground/40 border-muted-foreground/20 focus-within:ring-foreground/60 flex items-center rounded-full border-1 pl-4 transition-[border-color] focus-within:ring-1">
          <input
            type="text"
            placeholder="Search"
            defaultValue={searchQuery ?? ""}
            className="placeholder:text-muted-foreground flex-1 border-none bg-transparent text-sm outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
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
      </div>
    </form>
  );
}

export default DesktopSearch;
