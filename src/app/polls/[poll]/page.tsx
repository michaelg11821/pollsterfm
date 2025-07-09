import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { ArrowLeft, Clock, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type PollPageProps = {
  params: Promise<{ poll: string }>;
};

async function PollPage({ params }: PollPageProps) {
  const { poll } = await params;

  if (!poll) return redirect("/not-found");

  // Mock poll data
  const pollData = {
    id: poll,
    title: "Which album has the best production?",
    description:
      "Let's settle this debate once and for all. Vote for the album you think has the most impressive production quality.",
    creator: {
      name: "musiclover42",
      image: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2 days ago",
    endsIn: "3 days",
    totalVotes: 1248,
    category: "Albums",
    tags: ["Production", "Albums", "Debate"],
    options: [
      {
        id: 1,
        title: "Frank Ocean - Blonde",
        image: "/placeholder.svg?height=80&width=80",
        votes: 523,
        affinities: ["Introspective", "Atmospheric", "Minimalist"],
      },
      {
        id: 2,
        title: "Kendrick Lamar - To Pimp A Butterfly",
        image: "/placeholder.svg?height=80&width=80",
        votes: 412,
        affinities: ["Soulful", "Experimental", "Political"],
      },
      {
        id: 3,
        title: "Radiohead - In Rainbows",
        image: "/placeholder.svg?height=80&width=80",
        votes: 313,
        affinities: ["Ethereal", "Melancholic", "Textured"],
      },
    ],
    comments: [
      {
        id: 1,
        user: {
          name: "vinyl_enthusiast",
          image: "/placeholder.svg?height=40&width=40",
        },
        text: "Blonde's production is so minimal yet so effective. Every sound has its purpose.",
        timestamp: "1 day ago",
        likes: 24,
      },
      {
        id: 2,
        user: {
          name: "hiphophead",
          image: "/placeholder.svg?height=40&width=40",
        },
        text: "TPAB's jazz influences and layered production is unmatched. Thundercat and Flying Lotus killed it!",
        timestamp: "1 day ago",
        likes: 18,
      },
    ],
    recentActivity: [
      {
        id: 1,
        user: {
          name: "beatdrop",
          image: "/placeholder.svg?height=32&width=32",
        },
        action: "voted for",
        option: "Frank Ocean - Blonde",
        timestamp: "2 minutes ago",
      },
      {
        id: 2,
        user: {
          name: "synthwave_kid",
          image: "/placeholder.svg?height=32&width=32",
        },
        action: "voted for",
        option: "Kendrick Lamar - To Pimp A Butterfly",
        timestamp: "4 minutes ago",
      },
      {
        id: 3,
        user: {
          name: "indie_lover",
          image: "/placeholder.svg?height=32&width=32",
        },
        action: "voted for",
        option: "Radiohead - In Rainbows",
        timestamp: "7 minutes ago",
      },
      {
        id: 4,
        user: {
          name: "music_theory",
          image: "/placeholder.svg?height=32&width=32",
        },
        action: "commented",
        option: null,
        timestamp: "12 minutes ago",
      },
    ],
    liveStats: {
      votesInLastHour: 47,
      peakVotingTime: "2:30 PM",
      currentViewers: 23,
    },
  };

  // const handleVote = (optionId: number) => {
  //   setSelectedOption(optionId)
  // }

  // const submitVote = () => {
  //   if (selectedOption !== null) {
  //     setHasVoted(true)
  //     // Here you would submit the vote to your backend
  //   }
  // }

  // const calculatePercentage = (votes: number) => {
  //   return Math.round((votes / poll.totalVotes) * 100);
  // };

  return (
    <main className="content-wrapper px-5 py-8 xl:p-0">
      <Link
        href="/polls"
        className="text-primary hover:text-ring/50 mb-6 inline-flex items-center text-sm no-underline transition-[color]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to polls
      </Link>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-rose-500/30 bg-rose-500/10 text-rose-300"
              >
                {pollData.category}
              </Badge>
              <span className="text-foreground/60 flex items-center gap-1 text-sm">
                <Clock className="h-3 w-3" />
                Ends in {pollData.endsIn}
              </span>
            </div>
            <h1 className="mb-3 text-3xl font-bold lg:text-4xl">
              {pollData.title}
            </h1>
            <p className="text-muted-foreground mb-4 text-lg">
              {pollData.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-background relative m-0 flex h-10 w-10 cursor-pointer items-center justify-center gap-1.5 rounded-full border-none outline-0 focus:outline-2 focus:outline-offset-2">
                  {pollData.creator.image && (
                    <Image
                      src={pollData.creator.image}
                      alt=""
                      fill
                      className="rounded-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <Link
                    href={`/user/${pollData.creator.name}`}
                    className="text-foreground/80 hover:text-foreground"
                  >
                    {pollData.creator.name}
                  </Link>
                  <p className="text-muted-foreground text-sm">
                    {pollData.createdAt}
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
                  <Users className="h-3 w-3" />
                  {pollData.totalVotes.toLocaleString()} votes
                  <div className="ml-1 h-1 w-1 animate-pulse rounded-full bg-rose-400" />
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* {pollData.options.map((option) => (
                  <div
                    key={option.id}
                    className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
                      hasVoted
                        ? "bg-white/5 border-white/10"
                        : selectedOption === option.id
                          ? "bg-rose-500/10 border-rose-500/50 ring-1 ring-rose-500/30"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer"
                    }`}
                    onClick={() => !hasVoted && handleVote(option.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="shrink-0 h-16 w-16 rounded-lg overflow-hidden bg-black/20">
                          <Image
                            src={option.image || "/placeholder.svg"}
                            alt={option.title}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white mb-2">{option.title}</h3>
                          <div className="flex flex-wrap gap-1">
                            {option.affinities.map((affinity, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-rose-500/10 text-rose-300 border-rose-500/30 text-xs"
                              >
                                {affinity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {hasVoted && (
                          <div className="text-right shrink-0">
                            <span className="text-2xl font-bold text-rose-300">
                              {calculatePercentage(option.votes)}%
                            </span>
                            <p className="text-xs text-white/50">{option.votes.toLocaleString()} votes</p>
                          </div>
                        )}
                      </div>

                      {hasVoted && <Progress value={calculatePercentage(option.votes)} className="h-2 bg-white/10" />}
                    </div>
                  </div>
                ))} */}

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
                    {pollData.totalVotes.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-white/50">Time Left</p>
                  <p className="text-xl font-bold">{pollData.endsIn}</p>
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
                  {pollData.liveStats.currentViewers} viewing
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="bg-accent/80 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold">
                    {pollData.liveStats.votesInLastHour}
                  </p>
                  <p className="text-muted-foreground text-xs">votes/hour</p>
                </div>
                <div className="bg-accent/80 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold">
                    {pollData.liveStats.peakVotingTime}
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
    </main>
  );
}

export default PollPage;
