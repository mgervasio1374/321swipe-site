"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { PhotoFrame } from "@/app/components/ui/PhotoFrame";
import { DashboardVisual } from "@/app/components/hero/DashboardVisual";
import { EASE } from "@/app/lib/animations";

function fadeUp(delay = 0): Pick<HTMLMotionProps<"div">, "initial" | "animate" | "transition"> {
  return {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: EASE },
  };
}

interface HeroSectionProps {
  photo: string | null;
}

export function HeroSection({ photo }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const txtParallax = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(130deg, #f9fbfe 0%, #f1f5f9 40%, #f9fbfe 100%)" }}
    >
      {/* Soft dot grid — keeps the copy side from feeling flat */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(12,21,36,0.07) 1.2px, transparent 1.2px)",
          backgroundSize: "40px 40px",
          opacity: 0.22,
        }}
      />

      <div className="relative grid lg:grid-cols-[0.9fr_1.1fr] min-h-[100svh] lg:min-h-[720px]">

        {/* ── Left: copy ── */}
        <motion.div
          style={{ y: txtParallax }}
          className="relative z-10 flex flex-col justify-center px-6 pt-28 pb-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-12 lg:pt-24"
        >
          <motion.div {...fadeUp(0.05)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50/90 px-3.5 py-1.5 text-xs font-semibold text-navy-700 mb-6 shadow-sm">
              <span className="relative flex w-1.5 h-1.5">
                <span className="live-ring absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-60" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-accent-500" />
              </span>
              Contractor-first payment intelligence
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.15)}
            className="font-bold tracking-[-0.038em] leading-[1.03]"
            style={{ fontSize: "clamp(2.5rem, 4.6vw, 4rem)" }}
          >
            <span className="block text-navy-700/80 font-semibold">Modern payments.</span>
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
            <span className="block text-navy-900">Built for the trades.</span>
          </motion.h1>

          <motion.p {...fadeUp(0.28)} className="mt-5 text-[1rem] text-slate-500 leading-[1.72] max-w-[460px]">
            Most home service contractors overpay their processor every month — and never know it.
            321 Swipe reviews your statements, finds the hidden fees, and shows you exactly what
            your payments are costing you.
          </motion.p>

          <motion.div {...fadeUp(0.43)} className="mt-7 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
            <Button variant="secondary" onClick={() => window.Tawk_API?.maximize?.()} className="text-sm px-6 py-3">
              Talk to 321 Swipe
            </Button>
          </motion.div>

          <motion.div
            {...fadeUp(0.54)}
            className="mt-8 pt-5 border-t border-slate-200/70 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400"
          >
            {[
              { strong: "$15M+", label: "processed every month" },
              { strong: "250+", label: "active merchants" },
              { strong: "Independent,", label: "not PE-owned" },
              { strong: "Month-to-month", label: "relationships" },
            ].map((item) => (
              <span key={item.strong} className="flex items-center gap-1">
                <span className="font-semibold text-slate-600">{item.strong}</span>
                <span>{item.label}</span>
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: photography + floating dashboard ── */}
        <div className="relative flex flex-col lg:block lg:min-h-0">
          <PhotoFrame
            src={photo}
            alt="An HVAC technician taking a card payment from a homeowner in her kitchen"
            brief="HVAC technician in a homeowner's kitchen, tapping a customer's card on a phone reader. Late-afternoon window light."
            tone="warm"
            motion="kenburns"
            position="70% 40%"
            briefPosition="top-right"
            priority
            className="h-[340px] w-full lg:h-auto lg:absolute lg:inset-0 lg:[clip-path:polygon(9%_0,100%_0,100%_100%,0_100%)]"
          />
          {/* blend into the copy side */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none hidden lg:block"
            style={{ background: "linear-gradient(90deg, #f3f6fa 0%, rgba(243,246,250,0.6) 8%, transparent 22%)" }}
          />

          <motion.div
            initial={{ opacity: 0, x: 48, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.18, ease: EASE }}
            className="relative -mt-14 mx-auto w-[min(92%,340px)] pb-12 lg:absolute lg:mt-0 lg:pb-0 lg:mx-0 lg:left-[-24px] lg:bottom-10 lg:w-[300px]"
          >
            <DashboardVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
