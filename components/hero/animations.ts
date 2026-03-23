import type { Variants } from "framer-motion";

export const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren:   0.4,
    },
  },
};

export const FADE_UP: Variants = {
  hidden:  { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y:       0,
    filter:  "blur(0px)",
    transition: {
      duration: 1.1,
      ease:     [0.16, 1, 0.3, 1],
    },
  },
};

export const REVEAL_LINE: Variants = {
  hidden:  { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 1.4,
      ease:     [0.77, 0, 0.175, 1],
      delay:    0.2,
    },
  },
};

export const LETTER_SHIMMER: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};
