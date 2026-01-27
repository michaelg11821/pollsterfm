"use client";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { formatTimeRemaining, getDateFromCreatedAt } from "@/lib/convex-utils";
import { api } from "@/lib/convex/_generated/api";
import type { Id } from "@/lib/convex/_generated/dataModel";
import { useCountdown } from "@/lib/hooks/useCountdown";
import { toastManager } from "@/lib/toast";
import type { Affinity } from "@/lib/types/pollster";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Clock, ExternalLink, TrendingUp, Users, Vote } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Choice from "../choice/choice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import PollSkeleton from "./skeleton";

import * as Sentry from "@sentry/nextjs";
import Image from "next/image";

type PollProps = {
  id: Id<"polls">;
};

function Poll({ id }: PollProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const router = useRouter();

  const pollData = useQuery(api.pollster.poll.getById, { id });
  const recentActivity = useQuery(api.pollster.poll.getRecentActivity, {
    pollId: id,
  });
  const viewPoll = useMutation(api.pollster.poll.view);
  const unviewPoll = useMutation(api.pollster.poll.unview);

  const currentUser = useQuery(api.user.currentUser);
  const hasVoted = useQuery(api.user.hasVotedInPoll, { pollId: id }) ?? false;
  const addVote = useMutation(api.user.addVote);

  const authorData = useQuery(api.user.getProfileById, {
    userId: pollData?.authorId,
  });

  const endTime = pollData ? pollData.expiresAt : 0;
  const { timeLeft, isExpired } = useCountdown(endTime);

  const previousUserIdRef = useRef<Id<"users"> | null>(null);

  useEffect(() => {
    if (currentUser?._id) {
      previousUserIdRef.current = currentUser._id;
    }
  }, [currentUser]);

  useEffect(() => {
    if (isExpired) return;

    async function view() {
      if (!currentUser) return;

      try {
        await viewPoll({ id });
      } catch (err: unknown) {
        Sentry.captureException(err);
      }
    }

    view();

    const handleBeforeUnload = () => {
      if (previousUserIdRef.current === null) return;

      unviewPoll({ id, userId: previousUserIdRef.current }).catch((err) =>
        Sentry.captureException(err),
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (previousUserIdRef.current === null) return;

      unviewPoll({ id, userId: previousUserIdRef.current }).catch((err) =>
        Sentry.captureException(err),
      );
    };
  }, [id, unviewPoll, viewPoll, isExpired, currentUser]);

  const getSelectedChoiceData = useCallback(() => {
    if (selectedOption === null || pollData === null || pollData === undefined)
      return null;

    const { artist, album, track, affinities } =
      pollData.choices[selectedOption];

    return { artist, album, track, affinities };
  }, [selectedOption, pollData]);

  if (
    pollData === undefined ||
    currentUser === undefined ||
    authorData === undefined
  ) {
    return <PollSkeleton />;
  }

  if (pollData === null || authorData === null) {
    router.push("/not-found");

    return null;
  }

  const isAuthor = currentUser?._id === pollData.authorId;
  const hasVotedOrIsAuthor = hasVoted || isAuthor;

  const handleVote = (optionIndex: number) => {
    if (currentUser === null) {
      return toastManager.add({
        title: "Error",
        description: "You must be logged in to vote.",
      });
    } else if (isExpired) {
      return toastManager.add({
        title: "Error",
        description: "This poll has ended.",
      });
    } else if (isAuthor) {
      return;
    }

    setSelectedOption(optionIndex);
  };

  const submitVote = async (
    artist: string,
    album: string | null,
    track: string | null,
    affinities: Affinity[],
    choiceIndex: number,
  ) => {
    if (currentUser === null) {
      return toastManager.add({
        title: "Error",
        description: "You must be logged in to vote.",
      });
    } else if (isExpired) {
      return toastManager.add({
        title: "Error",
        description: "This poll has ended.",
      });
    } else if (pollData.authorId === currentUser._id) {
      return toastManager.add({
        title: "Error",
        description: "You cannot vote in your own poll.",
      });
    }

    if (selectedOption === null) return;

    const vote = await addVote({
      artist,
      album,
      track,
      affinities,
      pollId: id,
      choiceIndex,
    });

    if (vote === null) {
      return toastManager.add({
        title: "Success",
        description: "Successfully submitted vote.",
      });
    } else {
      return toastManager.add({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
      });
    }
  };

  const calculatePercentage = (votes: number) => {
    if (pollData.totalVotes === 0) return 0;

    return Math.round((votes / pollData.totalVotes) * 100);
  };

  const selectedChoiceData = getSelectedChoiceData();

  const peakVotingTime = pollData.liveStats
    ? new Date(pollData.liveStats.peakVotingTime).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  const timeRemainingString = formatTimeRemaining(timeLeft);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <header>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="font-medium">
              {pollData.pollType}
            </Badge>
            {!isExpired && (
              <Badge
                variant="outline"
                className="border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
              >
                <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                Live
              </Badge>
            )}
            <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Clock className="h-3.5 w-3.5" />
              {isExpired ? (
                <span className="text-destructive">Ended</span>
              ) : (
                timeRemainingString
              )}
            </span>
          </div>

          <h1 className="mb-3 text-3xl font-bold tracking-tight lg:text-4xl">
            {pollData.question}
          </h1>

          {pollData.description && (
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              {pollData.description}
            </p>
          )}

          <div className="flex items-center gap-3">
            <div className="bg-background relative m-0 flex h-10 w-10 items-center justify-center gap-1.5 rounded-full border-none outline-0 focus:outline-2 focus:outline-offset-2">
              {authorData.image && (
                <Image
                  src={authorData.image}
                  alt=""
                  fill
                  className="rounded-full object-cover"
                />
              )}
            </div>
            <div className="text-sm">
              <Link
                href={`/user/${authorData.username}`}
                className="hover:text-primary font-medium transition-colors"
              >
                {authorData.username}
              </Link>
              <p className="text-muted-foreground">
                {getDateFromCreatedAt(pollData._creationTime)}
              </p>
            </div>
          </div>
        </header>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Vote className="h-5 w-5" />
                {hasVotedOrIsAuthor ? "Results" : "Cast Your Vote"}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-normal">
                  <Users className="mr-1.5 h-3.5 w-3.5" />
                  {pollData.totalVotes.toLocaleString()} vote
                  {pollData.totalVotes !== 1 && "s"}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {pollData.choices.map((choice, index) => (
              <Choice
                key={index}
                choice={choice}
                hasVoted={hasVotedOrIsAuthor}
                selectedOption={selectedOption}
                index={index}
                handleVote={handleVote}
                calculatePercentage={calculatePercentage}
                pollEnded={isExpired}
              />
            ))}

            {!hasVoted && !isAuthor && (
              <Button
                className="mt-4 h-11 w-full cursor-pointer text-base font-medium"
                variant="default"
                disabled={
                  selectedOption === null || currentUser === null || isExpired
                }
                onClick={() => {
                  if (!selectedChoiceData) return;
                  if (selectedOption === null) return;

                  submitVote(
                    selectedChoiceData.artist,
                    selectedChoiceData.album,
                    selectedChoiceData.track,
                    selectedChoiceData.affinities as Affinity[],
                    selectedOption,
                  );
                }}
              >
                {isExpired
                  ? "Poll Ended"
                  : currentUser === null
                    ? "Sign in to vote"
                    : "Submit Vote"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Poll Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                  Total Votes
                </p>
                <p className="text-2xl font-bold tabular-nums">
                  {pollData.totalVotes.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                  Time Left
                </p>
                <p
                  className={`text-2xl font-bold tabular-nums ${isExpired ? "text-destructive" : ""}`}
                >
                  {isExpired ? "Ended" : timeRemainingString}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {!isExpired && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Live Activity
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/40 bg-emerald-500/10 text-xs font-normal text-emerald-500"
                >
                  {pollData.liveStats?.currentViewers.length ?? 0} viewing
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold tabular-nums">
                    {pollData.liveStats?.votesInLastHour ?? 0}
                  </p>
                  <p className="text-muted-foreground text-xs">votes/hour</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold tabular-nums">
                    {peakVotingTime ?? "—"}
                  </p>
                  <p className="text-muted-foreground text-xs">peak time</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
                  Recent Activity
                </h4>

                {recentActivity && recentActivity.length >= 1 ? (
                  <div className="space-y-2.5">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={`activity-${index}`}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={activity.user.image} alt="" />
                          <AvatarFallback className="text-[10px]">
                            {activity.user.username
                              .substring(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/user/${activity.user.username}`}
                              className="hover:text-primary truncate font-medium transition-colors"
                            >
                              {activity.user.username}
                            </Link>
                            <ExternalLink className="text-muted-foreground h-3 w-3 shrink-0" />
                          </div>
                          <p className="text-muted-foreground truncate text-xs">
                            {activity.action}
                            {activity.choice && (
                              <span className="text-foreground font-medium">
                                {" "}
                                {activity.choice}
                              </span>
                            )}
                          </p>
                        </div>
                        <span className="text-muted-foreground shrink-0 text-xs">
                          {formatDistanceToNow(activity.timestamp, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No activity yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </aside>
    </div>
  );
}

export default Poll;
