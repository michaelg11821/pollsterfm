"use client";

import { api } from "@/lib/convex/_generated/api";
import { Id } from "@/lib/convex/_generated/dataModel";
import { useQuery } from "convex/react";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import {
  capitalize,
  durationToString,
  getDateFromCreatedAt,
} from "@/lib/utils";
import { Clock, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PollAuthorImage from "./author-image/author-image";
import PollSkeleton from "./skeleton";

type PollProps = {
  id: Id<"polls">;
};

function Poll({ id }: PollProps) {
  const router = useRouter();

  const pollData = useQuery(api.pollster.poll.getById, { id });

  if (pollData === undefined) {
    return <PollSkeleton />;
  }

  if (pollData === null) {
    router.push("/not-found");

    return null;
  }

  const durationString = durationToString(pollData.duration);

  // const handleVote = (optionId: number) => {
  //   setSelectedOption(optionId)
  // }

  // const submitVote = () => {
  //   if (selectedOption !== null) {
  //     setHasVoted(true)
  //     //
  //   }
  // }

  // const calculatePercentage = (votes: number) => {
  //   return Math.round((votes / poll.totalVotes) * 100);
  // };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-rose-500/30 bg-rose-500/10 text-rose-300"
            >
              {capitalize(pollData.pollType)}
            </Badge>
            <span className="text-foreground/60 flex items-center gap-1 text-sm">
              <Clock className="h-3 w-3" />
              Ends in {durationString}
            </span>
          </div>
          <h1 className="mb-3 text-3xl font-bold lg:text-4xl">
            {pollData.question}
          </h1>
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
              <span className="text-white">Cast Your Vote</span>
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-rose-500/30 bg-rose-500/10 text-rose-300"
              >
                <Users className="h-3 w-3" />0 votes
                {/* {pollData.totalVotes.toLocaleString()} votes */}
                <div className="ml-1 h-1 w-1 animate-pulse rounded-full bg-rose-400" />
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pollData.choices.map((choice, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
                  //   hasVoted
                  //     ? "bg-white/5 border-white/10"
                  //     : selectedOption === option.id
                  //       ? "bg-rose-500/10 border-rose-500/50 ring-1 ring-rose-500/30"
                  //       : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer"
                  "up"
                }`}
                // onClick={() => !hasVoted && handleVote(option.id)}
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
                      <h3 className="mb-2 font-semibold text-white">
                        {pollData.pollType === "artist"
                          ? choice.artist
                          : pollData.pollType === "album"
                            ? `${choice.album} — ${choice.artist}`
                            : `${choice.track} — ${choice.artist}`}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {choice.affinities.map((affinity, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-rose-500/30 bg-rose-500/10 text-xs text-rose-300"
                          >
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

            {/* {!hasVoted && (
                  <Button
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                    disabled={selectedOption === null}
                    onClick={submitVote}
                  >
                    Submit Vote
                  </Button>
                )} */}
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
                  0{/* {pollData.totalVotes.toLocaleString()} */}
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
                variant="outline"
                className="border-green-500/30 bg-green-500/10 text-xs text-green-300"
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
