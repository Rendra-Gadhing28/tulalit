"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuality } from "@/lib/quality";
import { playSfx } from "@/lib/sound";
import { physicsEases } from "@/lib/motion";

interface LoadingScreenProps {
  onFinish: () => void;
}

export function LoadingScreen({ onFinish }: LoadingScreenProps) {
  const [percent, setPercent] = useState<number>(10);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const { reportFpsBenchmark } = useQuality();

  useEffect(() => {
    let frameCount = 0;
    const startTime = performance.now();
    let animId: number;

    const measureFps = (now: number) => {
      frameCount++;
      if (now - startTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - startTime));
        reportFpsBenchmark(fps);
      } else {
        animId = requestAnimationFrame(measureFps);
      }
    };
    animId = requestAnimationFrame(measureFps);

    // Progress percentage sequence with intentional 99% tulalit freeze
    const t1 = setTimeout(() => setPercent(45), 200);
    const t2 = setTimeout(() => setPercent(80), 500);
    const t3 = setTimeout(() => {
      setPercent(99);
      setIsFrozen(true);
    }, 800);

    const t4 = setTimeout(() => {
      setIsFrozen(false);
      setPercent(100);
      playSfx("whoosh");
      setIsExiting(true);
    }, 1500);

    const t5 = setTimeout(() => {
      onFinish();
    }, 2700);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onFinish, reportFpsBenchmark]);

  const handleSkip = () => {
    playSfx("whoosh");
    setIsExiting(true);
    setTimeout(onFinish, 600);
  };

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          key="preloader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            scale: 2.2,
            filter: "blur(16px)",
            opacity: 0,
            transition: {
              duration: 1.2,
              ease: physicsEases.cinematic,
            },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-paper-base dark:bg-darkbg-base select-none overflow-hidden"
        >
          {/* Paper texture overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_23px,#E5DEC9_24px)] dark:bg-[linear-gradient(to_bottom,transparent_23px,#1E293B_24px)] bg-[size:100%_24px] opacity-40 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 text-center max-w-sm px-6"
          >
            {/* Animated Code Tag Icon with Heartbeat / Snail Pulse */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1, 1.1, 1],
              }}
              transition={{
                duration: 1.4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="w-16 h-16 mx-auto mb-4 relative flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full border-4 border-accent-mustard/30 border-t-accent-mustard animate-spin" />
              <span className="font-hand text-2xl font-bold text-ink-navy dark:text-white">
                &lt;/&gt;
              </span>
            </motion.div>

            <p className="font-hand text-3xl font-bold text-ink-navy dark:text-white">
              XII PPLG 3 — Sogadev x Tulalit
            </p>

            <p className="font-mono text-sm text-ink-brown dark:text-accent-mustard mt-2">
              {isFrozen
                ? "Loading kenangan... 99% (Sabar ya, Tulalit sebentar...)"
                : `Mempersiapkan yearbook... ${percent}%`}
            </p>

            {/* Staggered Loading Dots */}
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {[0, 0.2, 0.4].map((delay, idx) => (
                <motion.span
                  key={idx}
                  animate={{
                    scale: [1, 1.35, 1],
                    opacity: [0.35, 1, 0.35],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay,
                    ease: "easeInOut",
                  }}
                  className="w-2 h-2 rounded-full bg-accent-mustard inline-block"
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-4 w-full h-3 bg-paper-lines dark:bg-darkbg-card rounded-full overflow-hidden border border-black/10">
              <motion.div
                style={{ width: `${percent}%` }}
                className={`h-full transition-all duration-300 rounded-full ${
                  isFrozen ? "bg-amber-500 animate-pulse" : "bg-accent-terminal"
                }`}
              />
            </div>

            {/* Skip Button */}
            <button
              type="button"
              onClick={handleSkip}
              className="mt-6 text-xs font-mono text-ink-muted hover:text-ink-navy dark:hover:text-white underline underline-offset-4"
            >
              [ Langsung Masuk / Skip ]
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
