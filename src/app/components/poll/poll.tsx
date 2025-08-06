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
import { api } from "@/lib/convex/_generated/api";
import type { Id } from "@/lib/convex/_generated/dataModel";
import { useCountdown } from "@/lib/hooks/useCountdown";
import { toastManager } from "@/lib/toast";
import type { Affinity } from "@/lib/types/pollster";
import { formatTimeRemaining, getDateFromCreatedAt } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Clock, ExternalLink, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Choice from "../choice/choice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import PollAuthorImage from "./author-image/author-image";
import PollSkeleton from "./skeleton";

type PollProps = {
  id: Id<"polls">;
};

function Poll({ id }: PollProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const router = useRouter();

  const pollData = useQuery(api.pollster.poll.getById, { id });
  const currentUser = useQuery(api.user.currentUser);
  const addVote = useMutation(api.user.addVote);

  const viewPoll = useMutation(api.pollster.poll.view);
  const unviewPoll = useMutation(api.pollster.poll.unview);

  const endTime = pollData ? pollData._creationTime + pollData.duration : 0;
  const { timeLeft, isExpired } = useCountdown(endTime);

  useEffect(() => {
    if (isExpired) return;

    async function view() {
      await viewPoll({ id });
    }

    view();

    const handleBeforeUnload = () => {
      unviewPoll({ id }).catch(console.error);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      unviewPoll({ id }).catch(console.error);
    };
  }, [id, unviewPoll, viewPoll, isExpired]);

  const getSelectedChoiceData = useCallback(() => {
    if (selectedOption === null || pollData === null || pollData === undefined)
      return null;

    const { artist, album, track, affinities } =
      pollData.choices[selectedOption];

    return { artist, album, track, affinities };
  }, [selectedOption, pollData]);

  if (pollData === undefined || currentUser === undefined) {
    return <PollSkeleton />;
  }

  if (pollData === null) {
    router.push("/not-found");

    return null;
  }

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
    }

    setSelectedOption(optionIndex);
  };

  const submitVote = async (
    artist: string,
    album: string | null,
    track: string | null,
    affinities: Affinity[],
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
    }

    if (selectedOption === null) return;

    const vote = await addVote({
      artist,
      album,
      track,
      affinities,
      pollId: id,
      choiceIndex: selectedOption,
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

  const hasVoted =
    currentUser && currentUser.choices
      ? currentUser.choices.some((choice) => choice.pollId === id)
      : false;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="default">{pollData.pollType}</Badge>
            <span className="text-foreground/60 flex items-center gap-1 text-sm">
              <Clock className="h-3 w-3" />
              {isExpired ? "Poll ended" : `Ends in ${timeRemainingString}`}
            </span>
          </div>
          <h2 className="mb-3 text-3xl font-bold lg:text-4xl">
            {pollData.question}
          </h2>
          <p className="text-muted-foreground mb-4 text-lg">
            {pollData.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PollAuthorImage username={pollData.author} />
              <div>
                <Link
                  href={`/user/${pollData.author}`}
                  className="text-foreground/80 hover:text-foreground"
                >
                  {pollData.author}
                </Link>
                <p className="text-muted-foreground text-sm">
                  {getDateFromCreatedAt(pollData._creationTime)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg">Cast Your Vote</span>
              <Badge variant="default" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {pollData.totalVotes.toLocaleString()} vote
                {(pollData.totalVotes <= 0 || pollData.totalVotes > 1) && "s"}
                <div className="bg-primary/90 ml-1 h-1 w-1 animate-pulse rounded-full" />
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pollData.choices.map((choice, index) => (
              <Choice
                key={index}
                choice={choice}
                hasVoted={hasVoted}
                selectedOption={selectedOption}
                index={index}
                handleVote={handleVote}
                calculatePercentage={calculatePercentage}
              />
            ))}

            {!hasVoted && (
              <Button
                className="w-full cursor-pointer transition-opacity select-none"
                variant="default"
                disabled={
                  selectedOption === null || currentUser === null || isExpired
                }
                onClick={() => {
                  if (!selectedChoiceData) return;

                  submitVote(
                    selectedChoiceData.artist,
                    selectedChoiceData.album,
                    selectedChoiceData.track,
                    selectedChoiceData.affinities as Affinity[],
                  );
                }}
              >
                {isExpired ? "Poll Ended" : "Submit Vote"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Poll Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground mb-1 text-xs">
                  Total Votes
                </p>
                <p className="text-xl font-bold">
                  {pollData.totalVotes.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs">Time Left</p>
                <p
                  className={`text-xl font-bold ${isExpired ? "text-red-400" : ""}`}
                >
                  {isExpired ? "Expired" : timeRemainingString}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {!isExpired && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                  <span>Live Activity</span>
                </div>
                <Badge
                  variant="default"
                  className="border-transparent bg-green-500/10 text-green-300"
                >
                  {pollData.liveStats?.currentViewers.length ?? 0} viewing
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="bg-accent/80 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold">
                    {pollData.liveStats?.votesInLastHour ?? 0}
                  </p>
                  <p className="text-muted-foreground text-xs">votes/hour</p>
                </div>

                <div className="bg-accent/80 rounded-lg p-2 text-center">
                  {pollData.liveStats && (
                    <p className="text-lg font-bold">{peakVotingTime}</p>
                  )}

                  <p className="text-muted-foreground text-xs">peak time</p>
                </div>
              </div>

              <Separator className="text-muted-foreground/10" />

              <div className="space-y-2">
                <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                  Recent Activity
                </h4>

                {pollData.recentActivity && pollData.recentActivity.length >= 1
                  ? pollData.recentActivity.map((activity, index) => (
                      <div
                        key={`activity-${index}`}
                        className="flex items-center gap-1 text-sm"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={activity.user.image} alt="" />
                          <AvatarFallback className="text-xs">
                            {activity.user.username
                              .substring(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/user/${activity.user.username}`}
                            className="inline-flex items-center gap-1 font-medium"
                          >
                            {activity.user.username}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                          <span className="text-muted-foreground mx-1.5">
                            {activity.action}
                          </span>
                          {activity.choice && (
                            <span className="truncate font-medium select-none">
                              {activity.choice}
                            </span>
                          )}
                        </div>
                        <span className="text-muted-foreground shrink-0 text-xs">
                          {formatDistanceToNow(activity.timestamp, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    ))
                  : "None yet"}

                {pollData.recentActivity &&
                  pollData.recentActivity.length >= 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full cursor-pointer bg-transparent py-4.5 text-xs"
                    >
                      View All Activity
                    </Button>
                  )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Poll;
