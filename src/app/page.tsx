import ThemeToggle from "./components/theme-toggle";

import { ArrowRight, Search } from "lucide-react";
import { Button } from "./components/ui/button";

function Home() {
  return (
    <main>
      <section className="relative pt-24 pb-20">
        <div className="absolute inset-0 will-change-transform">
          <div className="bg-primary/5 absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full blur-[100px]"></div>
          <div className="bg-primary/5 absolute right-1/4 bottom-1/4 h-[600px] w-[600px] rounded-full blur-[100px]"></div>
        </div>

        <div className="content-wrapper relative mx-auto px-5 lg:mt-0 xl:p-0">
          <div className="mx-auto mb-16 max-w-5xl text-center">
            <p className="mt-2.5 mb-8 cursor-default text-5xl font-bold md:text-7xl">
              Your <span className="text-primary">opinion</span> matters.
            </p>
            <p className="text-foreground mx-auto mb-10 max-w-3xl text-xl md:text-2xl">
              Vote in polls, create reviews, and discover people who experience
              music like you do.
            </p>
            <div className="flex flex-col justify-center gap-4 md:flex-row">
              <Button
                variant="default"
                size="lg"
                className="bg-primary cursor-pointer px-8 py-5.5"
              >
                Get started
                <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="cursor-pointer bg-transparent px-8 py-5.5"
              >
                How it works
              </Button>
            </div>
          </div>

          <div className="hidden md:relative md:mx-auto md:mb-20 md:block md:max-w-168">
            <div className="bg-foreground/10 hover:border-muted-foreground/50 focus-within:border-foreground flex items-center rounded-full border p-2 pl-6 transition-[border-color]">
              <Search className="ml-3 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for music, affinities, or people..."
                className="placeholder:text-muted-foreground flex-1 border-none bg-transparent outline-none"
              />
              <Button
                variant="default"
                size="lg"
                className="bg-primary h-12 cursor-pointer rounded-full px-6"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>
      <ThemeToggle />
    </main>
  );
}

export default Home;
