"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { DashboardVisual } from "@/app/components/hero/DashboardVisual";
import { EASE } from "@/app/lib/animations";

function fadeUp(delay = 0): Pick<HTMLMotionProps<"div">, "initial" | "animate" | "transition"> {
  return {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: EASE },
  };
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  // Subtle parallax layers that drift on scroll — creates depth separation
  const bgParallax  = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const midParallax = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const txtParallax = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex items-center overflow-hidden"
    >
      {/* ════════════════════════════════════════════════════════════════════════
          ENVIRONMENTAL SYSTEM — 9 layered depth fields
          Each layer has a different scale, opacity, blur, and drift timing.
          Together they create subconscious atmospheric depth.
          ════════════════════════════════════════════════════════════════════════ */}

      {/* Layer 0 — Base surface tint (barely off-white, cooler than pure white) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-shimmer"
        style={{ background: "linear-gradient(130deg, rgba(249,251,254,0.95), rgba(241,245,249,0.98) 38%, rgba(249,251,254,1) 100%)" }}
      />


{/* Layer 4 — Warm center light (creates "lit stage" illusion — content sits in light) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 75% 60% at 35% 50%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.5) 50%, transparent 75%)",
        }}
      />

      {/* Layer 4.5 — Animated subtle gradient pulse for atmospheric depth */}
      <div
        aria-hidden
        className="gradient-pulse absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.04) 0%, rgba(99,148,246,0.02) 50%, rgba(37,99,235,0.04) 100%)",
        }}
      />

      {/* Layer 5 — Ultra-subtle dot grid — subconscious infrastructure depth */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(12,21,36,0.07) 1.2px, transparent 1.2px)",
          backgroundSize: "40px 40px",
          opacity: 0.28,
          y: bgParallax,
        }}
      />

      {/* Layer 6 — SVG topology — faint infrastructure curves and vertical guidelines */}
      <motion.svg
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        style={{ opacity: 0.022, y: midParallax }}
      >
        {/* Horizontal intelligence curves */}
        <path d="M -300 340 C 150 280 450 420 750 350 S 1050 270 1400 320" stroke="#0c1524" strokeWidth="1" fill="none" />
        <path d="M -300 430 C 100 380 400 490 700 420 S 1000 350 1400 400" stroke="#0c1524" strokeWidth="0.7" fill="none" />
        <path d="M -300 520 C 200 470 500 560 800 500 S 1100 430 1400 480" stroke="#0c1524" strokeWidth="0.5" fill="none" />
        {/* Vertical structural lines suggesting system columns */}
        <line x1="360" y1="0" x2="350" y2="800" stroke="#0c1524" strokeWidth="0.6" />
        <line x1="640" y1="0" x2="650" y2="800" stroke="#0c1524" strokeWidth="0.4" />
      </motion.svg>

      {/* Layer 7 — Animated intelligence-wave paths — suggests live payment flow */}
      <svg
        aria-hidden
        className="wave-drift absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        style={{ opacity: 0.028 }}
      >
        <defs>
          <linearGradient id="wave-grad-a" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#2563eb" stopOpacity="0" />
            <stop offset="25%"  stopColor="#2563eb" stopOpacity="1" />
            <stop offset="75%"  stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wave-grad-b" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#1d4ed8" stopOpacity="0" />
            <stop offset="40%"  stopColor="#2563eb" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M -100 460 Q 300 400 650 500 T 1400 440" stroke="url(#wave-grad-a)" strokeWidth="1.5" fill="none" />
        <path d="M -100 560 Q 250 500 600 580 T 1400 530" stroke="url(#wave-grad-b)" strokeWidth="1" fill="none" />
      </svg>

      {/* Layer 8 — Animated entry flow lines (draw on load, then hold) */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        style={{ opacity: 0.032 }}
      >
        <defs>
          <linearGradient id="entry-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#2563eb" stopOpacity="0" />
            <stop offset="30%"  stopColor="#2563eb" stopOpacity="1" />
            <stop offset="70%"  stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M -60 390 C 200 330 520 450 820 370 S 1120 300 1460 360"
          stroke="url(#entry-grad)" strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3.8, delay: 0.6, ease: EASE }}
        />
        <motion.path
          d="M -60 490 C 180 430 480 530 780 460 S 1080 390 1460 450"
          stroke="url(#entry-grad)" strokeWidth="0.9" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4.5, delay: 1.0, ease: EASE }}
        />
      </svg>

      {/* Layer 9 — SVG grain filter for film-grain texture depth */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" result="gray" />
          <feBlend in="SourceGraphic" in2="gray" mode="overlay" />
        </filter>
      </svg>
      <div
        aria-hidden
        className="grain-overlay absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ filter: "url(#hero-grain)", willChange: "transform" }}
      />

      {/* ════════════════════════════════════════════════════════════════════════
          CONTENT — pulled upward, tighter rhythm, asymmetric composition
          ════════════════════════════════════════════════════════════════════════ */}
      <motion.div
        className="relative w-full mx-auto max-w-7xl px-6 lg:px-8"
        style={{ paddingTop: "calc(60px + 1.5vh)", paddingBottom: "4vh", y: txtParallax }}
      >
        {/* Asymmetric grid — right column is wider and offset to break rigidity */}
        <div className="grid lg:grid-cols-[1fr_1.22fr] items-center gap-10 lg:gap-4">

          {/* ── Left: Copy ── */}
          <div className="flex flex-col items-start max-w-[520px]">

            {/* Badge pill */}
            <motion.div {...fadeUp(0.05)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50/90 px-3.5 py-1.5 text-xs font-semibold text-navy-700 mb-6 shadow-sm">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="live-ring absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-60" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-accent-500" />
                </span>
                Contractor-first payment intelligence
              </span>
            </motion.div>

            {/* ── Headline — iconic, fluid scale, three-line hierarchy ── */}
            <motion.h1
              {...fadeUp(0.15)}
              className="font-bold tracking-[-0.038em] leading-[1.03]"
              style={{ fontSize: "clamp(2.6rem, 5.8vw, 4.6rem)" }}
            >
              {/* Line 1 — lighter presence, sets the stage */}
              <span className="block text-navy-700/80 font-semibold">
                Modern payments.
              </span>

              {/* Line 2 — the dominant line, gradient + luminance */}
              <span
                className="block"
                style={{
                  background: "linear-gradient(125deg, #1a3ed4 0%, #2563eb 28%, #3b82f6 58%, #93c5fd 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 1px 28px rgba(37,99,235,0.22))",
                }}
              >
                Real intelligence.
              </span>

              {/* Line 3 — grounding, full navy */}
              <span className="block text-navy-900">
                Built for the trades.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              {...fadeUp(0.28)}
              className="mt-5 text-[1rem] text-slate-500 leading-[1.72] max-w-[440px]"
            >
              Most home service contractors overpay their processor every month — and never know it.
              321 Swipe reviews your statements, identifies hidden fees and pricing issues, and gives
              you clear visibility into what your payments are actually costing you.
            </motion.p>

            {/* Human trust signal */}
            <motion.p
              {...fadeUp(0.35)}
              className="mt-3 text-[11.5px] text-slate-400 flex items-center gap-1.5"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-accent-400 shrink-0">
                <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm0 1a5 5 0 00-4.546 2.916A5.986 5.986 0 008 14a5.986 5.986 0 004.546-2.084A5 5 0 008 9z" />
              </svg>
              Real people review real statements. Technology helps us find the leaks faster.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.43)}
              className="mt-7 flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            >
              <motion.a
                href="https://upload.321swipe.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-lg text-white font-semibold text-sm px-6 py-3 transition-colors"
                style={{
                  background: "linear-gradient(135deg, #0c1524 0%, #132040 100%)",
                  boxShadow: "0 1px 4px rgba(12,21,36,0.28), 0 6px 20px rgba(12,21,36,0.14), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                Request a Statement Review
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-60">
                  <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                </svg>
              </motion.a>
              <Button variant="secondary" onClick={() => (window as any).Tawk_API?.maximize?.()} className="text-sm px-6 py-3">
                Talk to 321 Swipe
              </Button>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              {...fadeUp(0.54)}
              className="mt-7 pt-5 border-t border-slate-100/90 flex flex-wrap gap-x-4 gap-y-2.5 text-xs text-slate-400"
            >
              <div className="flex items-center gap-1.5">
                <span className="flex gap-px">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </span>
                <span className="font-semibold text-slate-500">5.0</span>
                <span className="text-slate-400">· 300+ contractor clients</span>
              </div>
              <span className="w-px h-3.5 bg-slate-200 self-center hidden sm:block" />
              <span className="font-medium text-slate-500">Independent, not PE-owned</span>
              <span className="w-px h-3.5 bg-slate-200 self-center hidden sm:block" />
              <span className="text-slate-400">Real reviews by real advisors</span>
            </motion.div>

            {/* Payment type pulse — accepted card types with sequential glow */}
            <motion.div
              {...fadeUp(0.64)}
              className="mt-5 flex items-center gap-2.5"
            >
              <span className="text-[10px] font-medium text-slate-300 tracking-wide uppercase shrink-0">
                Accepts
              </span>
              {[
                { label: "Visa",       color: "#1a1f71" },
                { label: "Mastercard", color: "#eb001b" },
                { label: "Amex",       color: "#007bc1" },
                { label: "Discover",   color: "#e65c00" },
                { label: "ACH",        color: "#1a3460" },
              ].map((card, i) => (
                <motion.span
                  key={card.label}
                  animate={{ opacity: [0.45, 1, 0.45] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    delay: i * 0.48,
                    ease: "easeInOut",
                  }}
                  className="text-[9.5px] font-bold px-2 py-0.5 rounded border"
                  style={{
                    color: card.color,
                    borderColor: `${card.color}30`,
                    backgroundColor: `${card.color}08`,
                    letterSpacing: "0.04em",
                  }}
                >
                  {card.label}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Dashboard visual ── */}
          <motion.div
            initial={{ opacity: 0, x: 48, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.18, ease: EASE }}
            className="flex justify-center lg:justify-end lg:-mr-8 lg:mt-[-2%]"
            style={{ y: txtParallax }}
          >
            <DashboardVisual />
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle bottom fade into next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 inset-x-0 h-24"
        style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(248,250,252,0.55) 100%)" }}
      />
    </section>
  );
}
