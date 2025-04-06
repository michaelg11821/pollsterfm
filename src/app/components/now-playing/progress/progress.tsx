"use client";

import { useEffect, useState } from "react";

import { convertToDuration } from "@/lib/utils";

import styles from "./progress.module.css";

interface NowPlayingProgressProps {
  progressMs: number;
  durationMs: number;
}

function NowPlayingProgress({
  progressMs,
  durationMs,
}: NowPlayingProgressProps) {
  const [progressDuration, setProgressDuration] = useState<number>(0);
  const [progressWidth, setProgressWidth] = useState<number>(0);

  const initialWidth = (progressMs / durationMs) * 100;

  const trackProgress = convertToDuration(progressDuration);
  const trackDuration = convertToDuration(durationMs);

  const VISUAL_INCREMENT = 0.6;

  useEffect(() => {
    setProgressDuration(progressMs);
    setProgressWidth(initialWidth);

    const interval = setInterval(() => {
      setProgressWidth((prev) => {
        const newWidth = prev + VISUAL_INCREMENT;

        return newWidth >= 100 ? 100 : newWidth;
      });

      setProgressDuration((prev) => {
        const newDuration = prev + 1000;

        return newDuration >= durationMs ? durationMs : newDuration;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialWidth, progressMs, durationMs]);

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{
            width: `${progressWidth}%`,
          }}
        ></div>
      </div>
      <div className={styles.progressTime}>
        <span>{trackProgress}</span>
        <span>{trackDuration}</span>
      </div>
    </div>
  );
}

export default NowPlayingProgress;
