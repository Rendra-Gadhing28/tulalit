"use client";

import React from "react";
import { motion } from "framer-motion";

export function BentoGrid({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 ${className}`}
    >
      {children}
    </div>
  );
}

interface BentoCellProps {
  children: React.ReactNode;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2;
  className?: string;
  delay?: number;
}

export function BentoCell({
  children,
  colSpan = 1,
  rowSpan = 1,
  className = "",
  delay = 0,
}: BentoCellProps) {
  const colSpanClasses = {
    1: "lg:col-span-1",
    2: "lg:col-span-2",
    3: "lg:col-span-3",
    4: "lg:col-span-4 md:col-span-2",
  };

  const mdColSpanClasses = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-2",
    4: "md:col-span-2",
  };

  const rowSpanClasses = {
    1: "row-span-1",
    2: "row-span-2",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay,
        type: "spring",
        stiffness: 130,
        damping: 18,
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className={`relative bg-paper-light dark:bg-darkbg-card p-5 md:p-6 rounded-xl border-2 border-paper-lines dark:border-darkbg-border shadow-scrapbook overflow-hidden ${mdColSpanClasses[colSpan]} ${colSpanClasses[colSpan]} ${rowSpanClasses[rowSpan]} ${className}`}
    >
      {children}
    </motion.div>
  );
}
