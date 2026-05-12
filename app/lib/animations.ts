import type { Variants } from "framer-motion";

// BezierDefinition requires [number,number,number,number] — not number[]
export const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
export const EASE_SPRING: [number, number, number, number] = [0.34, 1.2, 0.64, 1];

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export function staggerVariants(
  baseDelay = 0,
  stagger = 0.1,
  direction: "up" | "left" | "right" = "up"
): Variants {
  const fromX =
    direction === "left" ? -24 : direction === "right" ? 24 : 0;
  return {
    hidden: { opacity: 0, y: direction === "up" ? 24 : 0, x: fromX },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        delay: baseDelay + i * stagger,
        duration: 0.5,
        ease: EASE,
      },
    }),
  };
}
