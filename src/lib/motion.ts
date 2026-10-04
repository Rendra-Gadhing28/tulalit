import type { Transition, Variants } from "framer-motion";
import type { QualityLevel } from "@/types";

/**
 * Standard cubic-bezier and spring physics tokens
 * Derived from animationtransition.md
 */
export const physicsEases = {
  /** Sinematik, melambat halus di akhir */
  cinematic: [0.22, 1, 0.36, 1] as const,
  /** Hentakan jatuh / plunge dramatis yang tegas */
  plunge: [0.76, 0, 0.24, 1] as const,
  /** Mekanisme jarum mekanik presisi */
  needle: [0.16, 1, 0.3, 1] as const,
  /** Overshoot spring bouncy */
  overshoot: [0.34, 1.56, 0.64, 1] as const,
};

export const springPresets = {
  /** 3D Mouse Parallax Tilt: Responsif, tanpa jitter, terasa solid */
  card3DTilt: {
    stiffness: 160,
    damping: 18,
  },
  /** 3D Card Flip: Putaran mantap tanpa clipping */
  card3DFlip: {
    stiffness: 85,
    damping: 14,
  },
  /** Memo Scrapbook Pinboard: Naik dengan pegas lembut */
  memoEntrance: {
    stiffness: 90,
    damping: 13,
  },
  /** Modal pop-up */
  modalBounce: {
    type: "spring" as const,
    stiffness: 260,
    damping: 24,
  },
};

export function getFadeInVariant(quality: QualityLevel): Variants {
  if (quality === "low") {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
    };
  }

  return {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 24,
      },
    },
  };
}

export function getCardHoverProps(quality: QualityLevel) {
  if (quality === "low") {
    return {};
  }
  return {
    whileHover: { y: -4, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 },
  };
}

export const smoothSpringTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};
