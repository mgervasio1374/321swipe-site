"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useState } from "react";
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

function Counter({ target, prefix = "", delay = 900 }: { target: number; prefix?: string; delay?: number }) {
  const val = useCountUp(target, delay);
  return <>{prefix}{val.toLocaleString()}</>;
}

// ── Icons (stroke, 24 grid) ───────────────────────────────────────────────────
const HouseIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" />
  </svg>
);
const WrenchIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M14.7 6.3a4 4 0 00-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 005.4-5.4l-2.4 2.4-2.1-2.1z" />
  </svg>
);
const BoltIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
const BulbIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const transactions = [
  { id: 1, merchant: "Apex Roofing LLC",    category: "Invoice paid",   amount: "+$4,250", time: "2m ago",  icon: HouseIcon },
  { id: 2, merchant: "FlowRight Plumbing",  category: "Mobile payment", amount: "+$890",   time: "18m ago", icon: WrenchIcon },
  { id: 3, merchant: "BrightLine Electric", category: "ACH · job pymt", amount: "+$3,100", time: "1h ago",  icon: BoltIcon },
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
  return (
    <div className="relative select-none">
      {/* Gentle float */}
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
          className="relative bg-white rounded-2xl overflow-hidden"
          style={{
            boxShadow: [
              "0 0 0 1px rgba(12,21,36,0.06)",
              "0 16px 48px rgba(12,21,36,0.18)",
              "0 40px 90px rgba(37,99,235,0.12)",
            ].join(", "),
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100/80">
            <div>
              <p className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-[0.08em]">Payment overview</p>
              <p className="text-[13.5px] font-bold text-navy-900 mt-0.5 tracking-tight">This month</p>
            </div>
            <span className="relative flex items-center gap-1.5 text-[10.5px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="relative flex w-2 h-2">
                <span className="live-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              Live
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100/80">
            {[
              { label: "Job payments", target: 48320, prefix: "$", delay: 950,  delta: "+12%" },
              { label: "Jobs funded",  target: 184,   prefix: "",  delay: 1060, delta: "+8%"  },
              { label: "Avg. job",     target: 262,   prefix: "$", delay: 1170, delta: "+4%"  },
            ].map((stat) => (
              <div key={stat.label} className="px-4 py-3">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.07em]">{stat.label}</p>
                <p className="text-[15px] font-bold text-navy-900 mt-0.5 leading-none tabular-nums">
                  <Counter target={stat.target} prefix={stat.prefix} delay={stat.delay} />
                </p>
                <p className="text-[10px] font-semibold text-emerald-600 mt-1">{stat.delta}</p>
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="px-5 pt-4 pb-2">
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.07em] mb-3">Weekly job payments</p>
            <div className="flex items-end gap-1.5 h-[52px]">
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
                      <div className="w-full h-full" style={{ background: h > 65 ? "#dde8f6" : "#eef2f8" }} />
                    )}
                  </motion.div>
                );
              })}
            </div>
            <div className="flex gap-1.5 mt-1.5">
              {dayLabels.map((d, i) => (
                <span key={i} className={`flex-1 text-center text-[9px] font-bold ${bars[i] === barPeak ? "text-accent-500" : "text-slate-300"}`}>
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div className="px-5 pt-2 pb-4">
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.07em] mb-2">Recent</p>
            <div className="flex flex-col gap-1">
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
                    <span className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-navy-700 border border-slate-100/80 shrink-0">
                      {tx.icon}
                    </span>
                    <div>
                      <p className="text-[11.5px] font-semibold text-navy-900 leading-none">{tx.merchant}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{tx.category} · {tx.time}</p>
                    </div>
                  </div>
                  <span className="text-[11.5px] font-bold text-emerald-600 tabular-nums">{tx.amount}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Floating insight chip — escapes the card bounds */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3, ease: EASE }}
          className="absolute -top-4 -right-3 lg:right-auto lg:-left-3 bg-white rounded-xl px-3.5 py-2.5 flex items-center gap-2.5"
          style={{ boxShadow: "0 6px 24px rgba(12,21,36,0.14), 0 0 0 1px rgba(12,21,36,0.06)" }}
        >
          <div className="w-7 h-7 rounded-full bg-accent-50 flex items-center justify-center text-accent-500 shrink-0">
            {BulbIcon}
          </div>
          <div>
            <p className="text-[10.5px] font-bold text-navy-900 leading-none">Insight from 321 Swipe</p>
            <p className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">~$480/mo in hidden fees found</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
