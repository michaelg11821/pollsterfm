import { useEffect, useState } from "react";

export function useCountdown(endTime: number) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const remaining = endTime - now;

      if (remaining <= 0) {
        setTimeLeft(0);
        setIsExpired(true);

        return;
      }

      setTimeLeft(remaining);
      setIsExpired(false);
    };

    calculateTimeLeft();

    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return { timeLeft, isExpired };
}
