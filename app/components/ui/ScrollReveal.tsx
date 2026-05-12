"use client";

import { motion } from "framer-motion";
import { EASE } from "@/app/lib/animations";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.55,
  direction = "up",
  className = "",
}: ScrollRevealProps) {
  const initial = {
    opacity: 0,
    y: direction === "up" ? 28 : 0,
    x: direction === "left" ? -28 : direction === "right" ? 28 : 0,
  };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function staggerChildren(staggerDelay = 0.1, baseDelay = 0) {
  return (index: number) => baseDelay + index * staggerDelay;
}
