"use client";

import { useState } from "react";
import { Heart, ThumbsDown, ThumbsUp } from "lucide-react";

import styles from "./reactions.module.css";

type ReactionsProps = {
  username: string;
  name: string | null;
};

type ReactionAnimation = {
  active?: boolean;
  rotation?: number;
  id?: number;
};

type ReactionAnimations = Record<string, ReactionAnimation[]>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Reactions({ username, name }: ReactionsProps) {
  const [reactionAnimations, setReactionAnimations] =
    useState<ReactionAnimations>({
      heart: [],
      thumbsUp: [],
      thumbsDown: [],
    });

  const triggerReaction = (reaction: "heart" | "thumbsUp" | "thumbsDown") => {
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
    <div className={styles.reactionContainer}>
      <p className={styles.reactionText}>
        {name ? `Send reaction to ${name}` : "Send a reaction"}
      </p>
      <div className={styles.reactionButtons}>
        <div className={styles.reactionButtonContainer}>
          <button
            className={styles.reactionButton}
            onClick={() => triggerReaction("heart")}
          >
            <Heart className={styles.heartIcon} />
          </button>
          {reactionAnimations.heart.map((animation) => (
            <div
              key={animation.id}
              className={styles.reactionAnimation}
              style={
                {
                  "--rotation": `${animation.rotation}deg`,
                } as React.CSSProperties
              }
            >
              <Heart className={styles.animatedHeart} />
            </div>
          ))}
        </div>
        <div className={styles.reactionButtonContainer}>
          <button
            className={styles.reactionButton}
            onClick={() => triggerReaction("thumbsUp")}
          >
            <ThumbsUp className={styles.thumbsUpIcon} />
          </button>
          {reactionAnimations.thumbsUp.map((animation) => (
            <div
              key={animation.id}
              className={styles.reactionAnimation}
              style={
                {
                  "--rotation": `${animation.rotation}deg`,
                } as React.CSSProperties
              }
            >
              <ThumbsUp className={styles.animatedThumbsUp} />
            </div>
          ))}
        </div>
        <div className={styles.reactionButtonContainer}>
          <button
            className={styles.reactionButton}
            onClick={() => triggerReaction("thumbsDown")}
          >
            <ThumbsDown className={styles.thumbsDownIcon} />
          </button>
          {reactionAnimations.thumbsDown.map((animation) => (
            <div
              key={animation.id}
              className={styles.reactionAnimation}
              style={
                {
                  "--rotation": `${animation.rotation}deg`,
                } as React.CSSProperties
              }
            >
              <ThumbsDown className={styles.animatedThumbsDown} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reactions;
