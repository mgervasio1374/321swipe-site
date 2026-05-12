"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE, EASE_SPRING } from "@/app/lib/animations";

// ── Counter animation ─────────────────────────────────────────────────────────
function useCountUp(target: number, delay = 900, duration = 1700) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let start: number | null = null;
      const tick = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay, duration]);
  return val;
}

function Counter({ target, prefix = "", suffix = "", delay = 900 }: {
  target: number; prefix?: string; suffix?: string; delay?: number;
}) {
  const val = useCountUp(target, delay);
  return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const transactions = [
  { id: 1, merchant: "Apex Roofing LLC",   category: "Invoice",      amount: "+$4,250", time: "2m ago",  icon: "🏠" },
  { id: 2, merchant: "FlowRight Plumbing", category: "Card Present", amount: "+$890",   time: "14m ago", icon: "🔧" },
  { id: 3, merchant: "Summit HVAC",        category: "ACH Transfer", amount: "+$3,100", time: "1h ago",  icon: "❄️" },
];

const bars      = [38, 62, 50, 75, 58, 91, 68];
const barPeak   = 91;
const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

const rowVariants: Variants = {
  hidden:  { opacity: 0, x: 10 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: 1.1 + i * 0.12, duration: 0.4, ease: "easeOut" as const },
  }),
};

// ── Component ─────────────────────────────────────────────────────────────────
export function DashboardVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end start"] });

  // Scroll-driven parallax — dashboard drifts upward as user scrolls into next section
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -55]);
  // Subtle scale reduction and opacity fade as it scrolls out
  const scaleOut  = useTransform(scrollYProgress, [0, 0.8], [1, 0.97]);
  const opacityOut = useTransform(scrollYProgress, [0, 0.85], [1, 0.7]);

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[520px] mx-auto lg:mx-0 select-none pb-14 lg:pb-16"
    >

      {/* ── Parallax + perspective wrapper ── */}
      <motion.div
        style={{ y: yParallax, scale: scaleOut, opacity: opacityOut }}
        className="relative"
      >
        {/* Perspective container — gives the card a very subtle 3D tilt */}
        <div style={{ perspective: "1400px" }}>

          {/* Float + subtle 3D rotation */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
            style={{ rotateY: -1.5, rotateX: 0.8 }}
          >

            {/* ── Main dashboard card ── */}
            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
              className="relative bg-white rounded-2xl overflow-hidden"
              style={{
                boxShadow: [
                  "0 0 0 1px rgba(12,21,36,0.055)",
                  "0 4px 8px rgba(12,21,36,0.04)",
                  "0 16px 48px rgba(12,21,36,0.10)",
                  "0 32px 80px rgba(37,99,235,0.07)",
                  "0 60px 120px rgba(37,99,235,0.04)",
                ].join(", "),
              }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100/80">
                <div>
                  <p className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-[0.08em]">
                    Payment Overview
                  </p>
                  <p className="text-[13.5px] font-bold text-navy-900 mt-0.5 tracking-tight">
                    This Month
                  </p>
                </div>
                {/* Live badge */}
                <span className="relative flex items-center gap-1.5 text-[10.5px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <span className="relative flex w-2 h-2">
                    <span className="live-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                    <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
                  </span>
                  Live
                </span>
              </div>

              {/* Stats row — animated counters */}
              <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100/80">
                {[
                  { label: "Volume",       target: 48320, prefix: "$", delay: 950  },
                  { label: "Transactions", target: 184,   prefix: "",  delay: 1060 },
                  { label: "Avg. Ticket",  target: 262,   prefix: "$", delay: 1170 },
                ].map((stat, i) => {
                  const deltas = ["+12%", "+8%", "+4%"];
                  return (
                    <div key={stat.label} className="px-4 py-3">
                      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.07em]">
                        {stat.label}
                      </p>
                      <p className="text-[15px] font-bold text-navy-900 mt-0.5 leading-none tabular-nums">
                        <Counter target={stat.target} prefix={stat.prefix} delay={stat.delay} />
                      </p>
                      <p className="text-[10px] font-semibold text-emerald-600 mt-1">{deltas[i]}</p>
                    </div>
                  );
                })}
              </div>

              {/* Bar chart */}
              <div className="px-5 pt-4 pb-2">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.07em] mb-3">
                  Daily Volume
                </p>
                <div className="flex items-end gap-1.5 h-[54px]">
                  {bars.map((h, i) => {
                    const isPeak = h === barPeak;
                    return (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-sm overflow-hidden"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.65 + i * 0.07, duration: 0.5, ease: EASE_SPRING }}
                        style={{ height: `${h}%`, transformOrigin: "bottom" }}
                      >
                        {isPeak ? (
                          <motion.div
                            className="w-full h-full"
                            animate={{ opacity: [1, 0.72, 1] }}
                            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                            style={{ background: "linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)" }}
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{ background: h > 65 ? "#dde8f6" : "#eef2f8" }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                <div className="flex gap-1.5 mt-1.5">
                  {dayLabels.map((d, i) => (
                    <span
                      key={i}
                      className={`flex-1 text-center text-[9px] font-bold ${bars[i] === barPeak ? "text-accent-500" : "text-slate-300"}`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Transactions */}
              <div className="px-5 pt-2 pb-4">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.07em] mb-2.5">
                  Recent
                </p>
                <div className="flex flex-col gap-1.5">
                  {transactions.map((tx, i) => (
                    <motion.div
                      key={tx.id}
                      custom={i}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-center justify-between py-1.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-xs border border-slate-100/80 shrink-0">
                          {tx.icon}
                        </span>
                        <div>
                          <p className="text-[11.5px] font-semibold text-navy-900 leading-none">
                            {tx.merchant}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {tx.category} · {tx.time}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11.5px] font-bold text-emerald-600 tabular-nums">
                        {tx.amount}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Inset bottom accent — suggests the card is part of a larger system */}
              <div
                aria-hidden
                className="absolute bottom-0 inset-x-0 h-10 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(37,99,235,0.025), transparent)" }}
              />
            </motion.div>

            {/* ── Floating insight chip — escapes the card bounds ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3, ease: EASE }}
              className="absolute -bottom-5 -left-5 bg-white rounded-xl px-3.5 py-2.5 flex items-center gap-2.5"
              style={{
                boxShadow: "0 6px 24px rgba(12,21,36,0.11), 0 0 0 1px rgba(12,21,36,0.055)",
                backdropFilter: "blur(2px)",
              }}
            >
              <div className="w-7 h-7 rounded-full bg-accent-50 flex items-center justify-center text-sm shrink-0 border border-accent-100/50">
                💡
              </div>
              <div>
                <p className="text-[10.5px] font-bold text-navy-900 leading-none">
                  Insight from 321 Swipe
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">
                  You could save ~$420/mo on fees
                </p>
              </div>
            </motion.div>

            {/* ── Floating deposit status ── escapes top-right ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.5, ease: EASE }}
              className="absolute -top-3.5 -right-4 bg-white rounded-xl px-3 py-2 flex items-center gap-1.5"
              style={{
                boxShadow: "0 4px 16px rgba(12,21,36,0.09), 0 0 0 1px rgba(12,21,36,0.05)",
              }}
            >
              <span className="relative flex w-2 h-2 shrink-0">
                <span className="live-ring absolute inline-flex w-full h-full rounded-full bg-emerald-400" style={{ animationDelay: "0.8s" }} />
                <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] font-semibold text-slate-600 whitespace-nowrap">
                Next deposit in 18h
              </span>
            </motion.div>

            {/* ── New: Savings alert chip — bottom right, different elevation ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 1.65, ease: EASE }}
              className="absolute -bottom-10 right-4 bg-white rounded-xl px-3 py-2 flex items-center gap-2"
              style={{
                boxShadow: "0 4px 16px rgba(12,21,36,0.08), 0 0 0 1px rgba(37,99,235,0.08)",
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}
              >
                <svg viewBox="0 0 10 10" fill="white" className="w-2.5 h-2.5">
                  <path d="M5 1v4l2.5 1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-navy-900 whitespace-nowrap">
                $8,240 processed today
              </span>
            </motion.div>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
