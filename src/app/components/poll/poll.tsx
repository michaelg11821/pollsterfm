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
import { toastManager } from "@/lib/toast";
import type { Affinity } from "@/lib/types/pollster";
import { durationToString, getDateFromCreatedAt } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { Clock, ExternalLink, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
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

  const durationString = durationToString(pollData.duration);

  const hasVoted =
    currentUser && currentUser.choices
      ? currentUser.choices.some((choice) => choice.pollId === id)
      : false;

  const handleVote = (optionIndex: number) => {
    if (currentUser === null) {
      return toastManager.add({
        title: "Error",
        description: "You must be logged in to vote.",
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
    }

    if (selectedOption === null) return;

    const vote = await addVote({
      artist,
      album,
      track,
      affinities,
      pollId: id,
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

  const selectedChoiceData = getSelectedChoiceData();

  // const calculatePercentage = (votes: number) => {
  //   return Math.round((votes / poll.totalVotes) * 100);
  // };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="default">{pollData.pollType}</Badge>
            <span className="text-foreground/60 flex items-center gap-1 text-sm">
              <Clock className="h-3 w-3" />
              Ends in {durationString}
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
                {pollData.totalVotes.toLocaleString()} votes
                <div className="bg-primary/90 ml-1 h-1 w-1 animate-pulse rounded-full" />
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pollData.choices.map((choice, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
                  hasVoted
                    ? "bg-card border"
                    : selectedOption === index
                      ? "border-primary/50 bg-primary/20 ring-ring/30 ring-1"
                      : "cursor-pointer border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                }`}
                onClick={() => !hasVoted && handleVote(index)}
              >
                <div className="p-4">
                  <div className="mb-3 flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/20">
                      <Image
                        src={choice.image}
                        alt=""
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 space-y-1">
                        {choice.track && (
                          <Link
                            href={`/catalog/${encodeURIComponent(choice.artist)}/discography/${encodeURIComponent(choice.album!)}/${encodeURIComponent(choice.track)}`}
                            className="block w-fit font-semibold"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {choice.track}
                            <ExternalLink className="ml-1 inline h-3 w-3 opacity-60" />
                          </Link>
                        )}

                        {choice.artist && (
                          <Link
                            href={`/catalog/${encodeURIComponent(choice.artist)}`}
                            className={
                              choice.album || choice.track
                                ? "text-muted-foreground block w-fit text-sm"
                                : "block w-fit font-semibold"
                            }
                            onClick={(e) => e.stopPropagation()}
                          >
                            {(choice.album || choice.track) && "by "}
                            {choice.artist}
                            <ExternalLink className="ml-1 inline h-3 w-3 opacity-60" />
                          </Link>
                        )}

                        {choice.album && (
                          <Link
                            href={`/catalog/${encodeURIComponent(choice.artist)}/discography/${encodeURIComponent(choice.album)}`}
                            className="text-muted-foreground block w-fit text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {choice.track && "from"} {choice.album}
                            <ExternalLink className="ml-1 inline h-3 w-3 opacity-60" />
                          </Link>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {choice.affinities.map((affinity, index) => (
                          <Badge key={index} variant="secondary">
                            {affinity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {/* {hasVoted && (
                          <div className="text-right shrink-0">
                            <span className="text-2xl font-bold text-rose-300">
                              {calculatePercentage(option.votes)}%
                            </span>
                            <p className="text-xs text-white/50">{option.votes.toLocaleString()} votes</p>
                          </div>
                        )} */}
                  </div>

                  {/* {hasVoted && <Progress value={calculatePercentage(option.votes)} className="h-2 bg-white/10" />} */}
                </div>
              </div>
            ))}

            {!hasVoted && selectedChoiceData && (
              <Button
                className="w-full cursor-pointer"
                variant="default"
                disabled={selectedOption === null || currentUser === null}
                onClick={() =>
                  submitVote(
                    selectedChoiceData.artist,
                    selectedChoiceData.album,
                    selectedChoiceData.track,
                    selectedChoiceData.affinities as Affinity[],
                  )
                }
              >
                Submit Vote
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
                <p className="mb-1 text-xs text-white/50">Total Votes</p>
                <p className="text-xl font-bold">
                  {pollData.totalVotes.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-white/50">Time Left</p>
                <p className="text-xl font-bold">{durationString}</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                0 viewing
                {/* {pollData.liveStats.currentViewers} viewing */}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="bg-accent/80 rounded-lg p-2 text-center">
                <p className="text-lg font-bold">
                  {/* {pollData.liveStats.votesInLastHour} */}
                </p>
                <p className="text-muted-foreground text-xs">votes/hour</p>
              </div>
              <div className="bg-accent/80 rounded-lg p-2 text-center">
                <p className="text-lg font-bold">
                  {/* {pollData.liveStats.peakVotingTime} */}
                </p>
                <p className="text-muted-foreground text-xs">peak time</p>
              </div>
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-2">
              <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                Recent Activity
              </h4>
              {/* {pollData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-2 text-sm">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={activity.user.image || "/placeholder.svg"} alt={activity.user.name} />
                        <AvatarFallback className="text-xs">
                          {activity.user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <span className="text-rose-300 font-medium">{activity.user.name}</span>
                        <span className="text-white/70 mx-1">{activity.action}</span>
                        {activity.option && (
                          <span className="text-white/90 font-medium truncate">{activity.option}</span>
                        )}
                      </div>
                      <span className="text-xs text-white/40 shrink-0">{activity.timestamp}</span>
                    </div>
                  ))} */}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full cursor-pointer text-xs"
            >
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Poll;
