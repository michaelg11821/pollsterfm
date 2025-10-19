import { ArrowRight, ChevronRight, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import HomepageSearch from "./components/homepage-search/homepage-search";
import RandomAffinities from "./components/random-affinities/random-affinities";
import RandomAffinitiesSkeleton from "./components/random-affinities/skeleton";
import { Badge } from "./components/ui/badge";
import { Button, buttonVariants } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function Home({ searchParams }: HomeProps) {
  const { query } = await searchParams;

  const searchQuery = query && typeof query !== "string" ? query[0] : query;

  return (
    <main>
      <section className="relative overflow-x-clip pt-24 pb-20">
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

          <HomepageSearch initialQuery={searchQuery} />
        </div>
      </section>

      <section>
        <div className="content-wrapper px-5">
          <div className="mb-12 flex flex-col items-start justify-between md:flex-row md:items-center">
            <div>
              <p className="mb-4 text-3xl font-bold md:text-4xl">
                Popular Polls
              </p>
              <p className="text-muted-foreground max-w-lg">
                Discover what the community is voting on and add your voice to
                the conversation.
              </p>
            </div>
            <Link
              href="/polls"
              className={buttonVariants({ variant: "secondary" })}
            >
              View All Polls <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Best Albums of 2023",
                votes: 1243,
                affinities: ["Contemporary", "Diverse"],
                hot: true,
              },
              {
                title: "Most Energetic Workout Songs",
                votes: 876,
                affinities: ["Energetic", "Motivational"],
              },
              {
                title: "Albums That Define Gen Z",
                votes: 754,
                affinities: ["Cultural", "Defining"],
              },
              {
                title: "Best Vocal Performances",
                votes: 692,
                affinities: ["Technical", "Emotional"],
              },
              {
                title: "Most Innovative Production",
                votes: 587,
                affinities: ["Experimental", "Creative"],
              },
              {
                title: "Songs That Make You Cry",
                votes: 521,
                affinities: ["Emotional", "Vulnerable"],
              },
            ].map((poll, i) => (
              <Card
                key={i}
                className="hover:bg-accent max-h-112.5 cursor-pointer transition-[background-color]"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2.5">
                    {poll.title}
                    {poll.hot && (
                      <Badge variant="default">
                        <span className="bg-primary h-2 w-2 rounded-full"></span>
                        HOT
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="my-1 flex flex-wrap gap-2">
                    {poll.affinities.map((affinity, j) => (
                      <Badge key={j} variant="secondary">
                        {affinity}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="-mt-5">
                  <div className="text-muted-foreground flex items-center text-sm">
                    <Users className="mr-1 h-5 w-5" />
                    <span>{poll.votes} votes</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="content-wrapper px-5">
          <div className="mb-12 flex flex-col items-start justify-between md:flex-row md:items-center">
            <div>
              <p className="mb-4 text-3xl font-bold md:text-4xl">
                Discover Through Affinities
              </p>
              <p className="text-muted-foreground max-w-lg">
                Affinities connect you with people who feel the same way about
                music.
              </p>
            </div>
            <Link href="#" className={buttonVariants({ variant: "secondary" })}>
              View All Affinities <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
          <Suspense fallback={<RandomAffinitiesSkeleton />}>
            <RandomAffinities />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

export default Home;
