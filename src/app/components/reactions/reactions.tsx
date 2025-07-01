"use client";

import { Heart, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState, type CSSProperties } from "react";

import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import { Button } from "../ui/button";

type ReactionsProps = {
  username: string;
};

type Reaction = "heart" | "thumbsUp" | "thumbsDown";

type ReactionAnimation = {
  active?: boolean;
  rotation?: number;
  id?: number;
};

type ReactionAnimations = Record<Reaction, ReactionAnimation[]>;

function Reactions({ username }: ReactionsProps) {
  const [reactionAnimations, setReactionAnimations] =
    useState<ReactionAnimations>({
      heart: [],
      thumbsUp: [],
      thumbsDown: [],
    });

  const name = useQuery(api.user.getName, { username });

  const triggerReaction = (reaction: Reaction) => {
    const randomRotation = Math.floor(Math.random() * 60) - 30;
    const id = Date.now();

    setReactionAnimations((prev) => ({
      ...prev,
      [reaction]: [
        ...prev[reaction],
        { active: true, rotation: randomRotation, id },
      ],
    }));

    setTimeout(() => {
      setReactionAnimations((prev) => ({
        ...prev,
        [reaction]: prev[reaction].filter((item) => item.id !== id),
      }));
    }, 1000);
  };

  return (
    <div className="sm:flex-end mt-4 flex flex-col items-center gap-1 sm:mt-0">
      <p className="text-muted-foreground mb-1 text-xs">
        {name ? `Send reaction to ${name}` : "Send a reaction"}
      </p>
      <div className="flex items-center gap-2.5 sm:gap-2">
        <div className="relative">
          <Button
            variant="secondary"
            size="icon"
            className="hover:bg-primary/20 hover:text-primary cursor-pointer rounded-full"
            onClick={() => triggerReaction("heart")}
          >
            <Heart className="w-4.5 sm:w-4" />
          </Button>
          {reactionAnimations.heart.map((animation) => (
            <div
              key={animation.id}
              className="animate-reaction-float pointer-events-none absolute bottom-[20%] left-[50%]"
              style={
                {
                  "--rotation": `${animation.rotation}deg`,
                } as CSSProperties
              }
            >
              <Heart className="h-6 w-6 fill-[#ff6b8b] text-[#ff6b8b]" />
            </div>
          ))}
        </div>
        <div className="relative">
          <Button
            variant="secondary"
            size="icon"
            className="hover:bg-primary/20 hover:text-primary cursor-pointer rounded-full"
            onClick={() => triggerReaction("thumbsUp")}
          >
            <ThumbsUp className="w-4.5 sm:w-4" />
          </Button>
          {reactionAnimations.thumbsUp.map((animation) => (
            <div
              key={animation.id}
              className="animate-reaction-float pointer-events-none absolute bottom-[20%] left-[50%]"
              style={
                {
                  "--rotation": `${animation.rotation}deg`,
                } as CSSProperties
              }
            >
              <ThumbsUp className="h-6 w-6 fill-[#4caf50] text-[#4caf50]" />
            </div>
          ))}
        </div>
        <div className="relative">
          <Button
            variant="secondary"
            size="icon"
            className="hover:bg-primary/20 hover:text-primary cursor-pointer rounded-full"
            onClick={() => triggerReaction("thumbsDown")}
          >
            <ThumbsDown className="w-4.5 sm:w-4" />
          </Button>
          {reactionAnimations.thumbsDown.map((animation) => (
            <div
              key={animation.id}
              className="animate-reaction-float pointer-events-none absolute bottom-[20%] left-[50%]"
              style={
                {
                  "--rotation": `${animation.rotation}deg`,
                } as CSSProperties
              }
            >
              <ThumbsDown className="h-6 w-6 fill-[#f44336] text-[#f44336]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reactions;
