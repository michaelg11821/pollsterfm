import { api } from "@/lib/convex/_generated/api";
import { cn } from "@/lib/next-utils";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import HeroPoll from "./components/hero-poll/hero-poll";
import HeroPollSkeleton from "./components/hero-poll/skeleton";
import PopularPolls from "./components/popular-polls/popular-polls";
import RandomAffinities from "./components/random-affinities/random-affinities";
import RandomAffinitiesSkeleton from "./components/random-affinities/skeleton";
import { buttonVariants } from "./components/ui/button";

export default async function Home() {
  const token = await convexAuthNextjsToken();
  const user = await fetchQuery(api.user.currentUser, {}, { token });
  return (
    <main>
      <section className="border-border overflow-hidden border-b py-16 md:py-24">
        <div className="content-wrapper px-4 sm:px-5">
          <div className="grid gap-8 md:gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="min-w-0">
              <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Track music you&apos;ve heard.
                <span className="text-muted-foreground">
                  {" "}
                  Find others who agree.
                </span>
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md text-base sm:text-lg">
                Vote on polls, build affinities, and connect with people who
                share your taste in music.
              </p>
              <div className="flex flex-wrap gap-3">
                {user ? (
                  <>
                    <Link
                      href="/create-poll"
                      className={cn(
                        buttonVariants({ variant: "default", size: "lg" }),
                        "bg-primary hover:bg-primary/90 group font-semibold",
                      )}
                    >
                      Create a poll
                      <svg
                        className="relative ml-2 h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </Link>
                    <Link
                      href="/polls"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "font-semibold",
                      )}
                    >
                      Browse polls
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      className={cn(
                        buttonVariants({ variant: "default", size: "lg" }),
                        "bg-primary hover:bg-primary/90 group font-semibold",
                      )}
                    >
                      Get started — it&apos;s free
                      <svg
                        className="relative ml-2 h-2.5 w-2.5 overflow-visible transition-transform duration-150 ease-out group-hover:translate-x-1"
                        viewBox="0 0 10 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          className="opacity-0 transition-opacity duration-0 ease-out group-hover:opacity-100"
                          d="M-6 5h10"
                        />
                        <path d="M1 1l4 4-4 4" />
                      </svg>
                    </Link>
                    <Link
                      href="/polls"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "font-semibold",
                      )}
                    >
                      Browse polls
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-6 text-sm sm:gap-8 md:mt-10">
                <div>
                  <div className="text-foreground text-xl font-bold sm:text-2xl">
                    1,000+
                  </div>
                  <div className="text-muted-foreground text-xs sm:text-sm">
                    Members
                  </div>
                </div>
                <div>
                  <div className="text-foreground text-xl font-bold sm:text-2xl">
                    500+
                  </div>
                  <div className="text-muted-foreground text-xs sm:text-sm">
                    Polls created
                  </div>
                </div>
                <div>
                  <div className="text-foreground text-xl font-bold sm:text-2xl">
                    10k+
                  </div>
                  <div className="text-muted-foreground text-xs sm:text-sm">
                    Votes cast
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 overflow-hidden lg:pl-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-muted-foreground text-sm font-medium">
                  Most popular poll
                </h2>
                <Link
                  href="/polls"
                  className="text-muted-foreground hover:text-foreground group flex items-center gap-1 text-sm transition-colors"
                >
                  See all
                  <svg
                    className="relative ml-1 h-2.5 w-2.5 overflow-visible transition-transform duration-150 ease-out group-hover:translate-x-1"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      className="opacity-0 transition-opacity duration-0 ease-out group-hover:opacity-100"
                      d="M-6 5h10"
                    />
                    <path d="M1 1l4 4-4 4" />
                  </svg>
                </Link>
              </div>
              <Suspense fallback={<HeroPollSkeleton />}>
                <HeroPoll />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <div className="content-wrapper px-4 py-8 sm:px-5 sm:py-12">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold sm:text-2xl">
                Popular this week
              </h2>
              <Link
                href="/polls"
                className="text-muted-foreground hover:text-foreground group flex items-center gap-1 text-sm transition-colors"
              >
                More
                <svg
                  className="relative h-2.5 w-2.5 overflow-visible transition-transform duration-150 ease-out group-hover:translate-x-1"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    className="opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100"
                    d="M-6 5h10"
                  />
                  <path d="M1 1l4 4-4 4" />
                </svg>
              </Link>
            </div>
            <PopularPolls />
          </div>

          <aside className="space-y-8 sm:space-y-10">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold sm:text-lg">
                  Popular affinities
                </h3>
                <Link
                  href="/affinities"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  See all
                </Link>
              </div>
              <Suspense fallback={<RandomAffinitiesSkeleton />}>
                <RandomAffinities amount={6} />
              </Suspense>
            </div>

            {user ? (
              <div className="bg-card border-border rounded-lg border p-6">
                <h3 className="mb-2 font-bold">Your profile</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  View your polls, votes, and affinities.
                </p>
                <Link
                  href={`/user/${user.username}`}
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "w-full",
                  )}
                >
                  Go to profile
                </Link>
              </div>
            ) : (
              <div className="bg-card border-border rounded-lg border p-6">
                <h3 className="mb-2 font-bold">Join Pollster.fm</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Create polls, vote on music, and discover people with similar
                  taste.
                </p>
                <Link
                  href="/sign-in"
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "w-full",
                  )}
                >
                  Sign up free
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>

      <section className="border-border border-t py-8 sm:py-12">
        <div className="content-wrapper px-4 sm:px-5">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Discover by affinity
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Find polls and people through shared musical traits
              </p>
            </div>
            <Link
              href="/affinities"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-fit",
              )}
            >
              Browse all
            </Link>
          </div>
          <Suspense fallback={<RandomAffinitiesSkeleton />}>
            <RandomAffinities amount={12} />
          </Suspense>
        </div>
      </section>

      <section className="border-border border-t py-12 sm:py-16">
        <div className="content-wrapper px-4 text-center sm:px-5">
          {user ? (
            <>
              <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
                Got an opinion to share?
              </h2>
              <p className="text-muted-foreground mx-auto mb-6 max-w-md text-sm sm:text-base">
                Create a poll and see how others vote on the music you care
                about.
              </p>
              <Link
                href="/polls/create"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "group font-semibold",
                )}
              >
                Create a poll
                <svg
                  className="relative ml-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </Link>
            </>
          ) : (
            <>
              <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
                Ready to share your opinion?
              </h2>
              <p className="text-muted-foreground mx-auto mb-6 max-w-md text-sm sm:text-base">
                Join the community and start voting on polls about the music you
                love.
              </p>
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "group font-semibold",
                )}
              >
                Create your free account
                <svg
                  className="relative ml-2 h-2.5 w-2.5 overflow-visible transition-transform duration-150 ease-out group-hover:translate-x-1"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    className="opacity-0 transition-opacity duration-0 ease-out group-hover:opacity-100"
                    d="M-6 5h10"
                  />
                  <path d="M1 1l4 4-4 4" />
                </svg>
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
