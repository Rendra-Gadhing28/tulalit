"use client";

import { useEffect, useState } from "react";

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isGraduated: boolean;
  daysSinceGraduation: number;
}

export function useCountdown(targetIsoDate: string): CountdownResult {
  const [timeLeft, setTimeLeft] = useState<CountdownResult>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isGraduated: false,
    daysSinceGraduation: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(targetIsoDate).getTime();
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        const elapsed = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isGraduated: true,
          daysSinceGraduation: elapsed,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isGraduated: false,
        daysSinceGraduation: 0,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetIsoDate]);

  return timeLeft;
}
