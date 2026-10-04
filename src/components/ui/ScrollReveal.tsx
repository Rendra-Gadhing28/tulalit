"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useQuality } from "@/lib/quality";

// Apple-standard ultra-smooth quintic-out curve: rapid initial acceleration, silk-smooth decay
const SMOOTH_CURVE = [0.16, 1, 0.3, 1] as const;

interface ScrollStaggerItemProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
  columns?: number;
  yOffset?: number;
}

export function ScrollStaggerItem({
  children,
  index = 0,
  className,
  columns = 4,
  yOffset = 20,
}: ScrollStaggerItemProps) {
  const { isReducedMotion, isHematMode, quality } = useQuality();

  if (isReducedMotion || isHematMode || quality === "low") {
    return <div className={className}>{children}</div>;
  }

  const delay = (index % columns) * 0.06;

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -30px 0px", amount: 0.1 }}
      transition={{
        duration: 0.7,
        delay,
        ease: SMOOTH_CURVE,
      }}
      style={{
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  yOffset = 28,
}: ScrollRevealProps) {
  const { isReducedMotion, isHematMode, quality } = useQuality();
  const disabled = isReducedMotion || isHematMode || quality === "low";

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px", amount: 0.1 }}
      transition={{
        duration: 0.8,
        delay,
        ease: SMOOTH_CURVE,
      }}
      style={{
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollProgressBar() {
  const { isReducedMotion, isHematMode } = useQuality();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (isReducedMotion || isHematMode) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-mustard via-accent-coral to-accent-sky z-50 origin-left"
      style={{ scaleX }}
    />
  );
}
