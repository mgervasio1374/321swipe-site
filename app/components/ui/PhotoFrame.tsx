"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export type PhotoTone = "navy" | "warm" | "light";
export type PhotoMotion = "none" | "kenburns" | "parallax";

interface PhotoFrameProps {
  src: string | null;
  alt: string;
  brief?: string;
  tone?: PhotoTone;
  motion?: PhotoMotion;
  position?: string;
  /** Where the placeholder brief sits (placeholder only). */
  briefPosition?: "bottom-left" | "top-right" | "top-left";
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const toneBg: Record<PhotoTone, string> = {
  navy:
    "radial-gradient(ellipse 70% 60% at 30% 25%, rgba(96,165,250,0.55) 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 80% 85%, rgba(29,78,216,0.65) 0%, transparent 60%), linear-gradient(160deg, #1a3460 0%, #0c1524 100%)",
  warm:
    "radial-gradient(ellipse 70% 60% at 70% 20%, rgba(251,191,36,0.35) 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 20% 90%, rgba(37,99,235,0.55) 0%, transparent 60%), linear-gradient(160deg, #1e3a5f 0%, #0c1524 100%)",
  light:
    "radial-gradient(ellipse 70% 60% at 30% 20%, rgba(255,255,255,0.9) 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 85% 80%, rgba(147,197,253,0.6) 0%, transparent 60%), linear-gradient(160deg, #eef4fb 0%, #c7d7ea 100%)",
};

export function PhotoFrame({
  src,
  alt,
  brief,
  tone = "navy",
  motion: motionKind = "none",
  position = "50% 50%",
  briefPosition = "bottom-left",
  priority = false,
  className = "",
  style,
  children,
}: PhotoFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Image drifts ~8% slower than the page — subtle depth, never distracting.
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const useParallax = motionKind === "parallax" && !reduce;
  const useKenBurns = motionKind === "kenburns" && !reduce;

  const inner = src ? (
    <motion.img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`absolute inset-0 w-full h-full object-cover ${useKenBurns ? "kenburns" : ""}`}
      style={{
        objectPosition: position,
        y: useParallax ? parallaxY : undefined,
        scale: useParallax ? 1.14 : undefined,
      }}
    />
  ) : (
    <motion.div
      aria-hidden
      className={`absolute inset-0 ${useKenBurns ? "kenburns" : ""}`}
      style={{
        background: toneBg[tone],
        y: useParallax ? parallaxY : undefined,
        scale: useParallax ? 1.14 : undefined,
      }}
    />
  );

  return (
    <div
      ref={ref}
      role={src ? undefined : "img"}
      aria-label={src ? undefined : alt}
      className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative"} overflow-hidden ${className}`}
      style={style}
    >
      {inner}
      {/* film grain — keeps flat placeholder gradients from looking like UI chrome */}
      <div aria-hidden className="absolute inset-0 grain pointer-events-none" style={{ opacity: src ? 0.06 : 0.18 }} />
      {!src && brief && (
        <div
          aria-hidden
          className={`absolute z-[2] hidden sm:block max-w-[300px] rounded-[10px] border border-white/15 px-3 py-2.5 text-white backdrop-blur-[6px] ${
            briefPosition === "top-right" ? "right-4 top-4" : briefPosition === "top-left" ? "left-4 top-4" : "left-4 bottom-4"
          }`}
          style={{ background: "rgba(6,13,28,0.72)" }}
        >
          <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-blue-300">Photo placeholder</p>
          <p className="mt-1 text-[11.5px] leading-[1.45] text-white/85">{brief}</p>
        </div>
      )}
      {children}
    </div>
  );
}
