"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { EASE } from "@/app/lib/animations";

/**
 * Statement analysis card that cycles through several contractor scenarios.
 * The scan line sweeps the card once per cycle; when it reaches the bottom the
 * next scenario fades in, so the sweep reads as a fresh review each time.
 */

const CYCLE_MS = 5000; // matches the `scan` keyframe duration in globals.css

interface ScenarioInput {
  client: string;
  trade: string;
  volume: number;        // monthly card volume, $
  currentRate: number;   // effective rate today, e.g. 0.0315
  optimizedRate: number; // effective rate after 321 Swipe
  fees: { label: string; amount: number }[]; // must sum to volume × currentRate (checked below)
  note: string;
}

/* Illustrative scenarios. Every displayed figure derives from ONE base per
 * scenario — volume and the two rates — so the fee rows, the rate change and
 * the savings always reconcile. Business names are fictional. */
const inputs: ScenarioInput[] = [
  {
    client: "Apex Roofing LLC",
    trade: "Roofing · $82k/mo volume",
    volume: 82_000, currentRate: 0.0315, optimizedRate: 0.0235,
    fees: [
      { label: "Interchange pass-through", amount: 1_704 },
      { label: "Processor markup",         amount: 510 },
      { label: "Avoidable fees",           amount: 369 },
    ],
    note: "5 avoidable fees identified",
  },
  {
    client: "FlowRight Plumbing",
    trade: "Plumbing · $46k/mo volume",
    volume: 46_000, currentRate: 0.0342, optimizedRate: 0.0241,
    fees: [
      { label: "Interchange pass-through", amount: 900 },
      { label: "Non-qualified surcharges", amount: 478 },
      { label: "PCI & statement fees",     amount: 195 },
    ],
    note: "Tiered pricing → interchange-plus",
  },
  {
    client: "BrightLine Electric",
    trade: "Electrical · $118k/mo volume",
    volume: 118_000, currentRate: 0.0289, optimizedRate: 0.0228,
    fees: [
      { label: "Interchange pass-through", amount: 2_480 },
      { label: "Processor markup",         amount: 560 },
      { label: "Interchange downgrades",   amount: 370 },
    ],
    note: "Level II data enabled",
  },
  {
    client: "Summit Heating & Air",
    trade: "HVAC · $64k/mo volume",
    volume: 64_000, currentRate: 0.0328, optimizedRate: 0.0239,
    fees: [
      { label: "Interchange pass-through",   amount: 1_470 },
      { label: "Monthly access & batch",     amount: 215 },
      { label: "Contract & compliance fees", amount: 414 },
    ],
    note: "3 contract fees removed",
  },
];

interface Scenario {
  client: string;
  trade: string;
  currentRate: string;
  optimizedRate: string;
  fees: { label: string; amount: string; pct: number }[];
  savings: string;
  note: string;
}

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const pct = (r: number) => (r * 100).toFixed(2) + "%";

const scenarios: Scenario[] = inputs.map((x) => {
  const total = x.volume * x.currentRate;
  const feeSum = x.fees.reduce((a, f) => a + f.amount, 0);
  if (process.env.NODE_ENV !== "production" && Math.abs(feeSum - total) > 1) {
    throw new Error(`AnalysisCard: ${x.client} fees ($${feeSum}) ≠ ${pct(x.currentRate)} of $${x.volume} ($${total.toFixed(0)})`);
  }
  const reduction = x.currentRate - x.optimizedRate;
  return {
    client: x.client,
    trade: x.trade,
    currentRate: pct(x.currentRate),
    optimizedRate: pct(x.optimizedRate),
    fees: x.fees.map((f) => ({ label: f.label, amount: usd(f.amount), pct: Math.round((f.amount / total) * 100) })),
    savings: usd(x.volume * reduction),
    note: `${x.note} · ${pct(reduction)} rate reduction`,
  };
});

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.35, ease: EASE },
};

export function AnalysisCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  // Advance only while visible so the cycle starts fresh when the card scrolls in.
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % scenarios.length);
      setCycleKey((k) => k + 1);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [inView]);

  const s = scenarios[index];

  return (
    <div
      ref={ref}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #0f1e3a 0%, #0c1524 100%)",
        boxShadow: "0 0 0 1px rgba(37,99,235,0.2), 0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Scan line — restarts with each scenario so the sweep and the data change stay in step */}
      {!reduce && inView && <div key={cycleKey} aria-hidden className="scan-line" />}

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(37,99,235,0.15)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <p className="text-xs font-semibold text-white leading-none">Statement analysis</p>
            <AnimatePresence mode="wait">
              <motion.p key={s.client} {...fade} className="text-[10px] text-navy-100/40 mt-0.5">
                {s.client} · {s.trade}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-navy-100/50 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full" title="Figures are representative examples, not a specific client's results">
          Illustrative example
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Rate comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-navy-100/45 mb-1">Your effective rate</p>
            <AnimatePresence mode="wait">
              <motion.p key={s.currentRate} {...fade} className="text-2xl font-bold tabular-nums text-white">{s.currentRate}</motion.p>
            </AnimatePresence>
            <p className="text-[9px] text-navy-100/35 mt-0.5">Current processor</p>
          </div>
          <div
            className="rounded-xl p-3.5"
            style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0.06) 100%)", border: "1px solid rgba(37,99,235,0.25)" }}
          >
            <p className="text-[9px] font-semibold uppercase tracking-widest text-navy-100/45 mb-1">Optimized rate</p>
            <AnimatePresence mode="wait">
              <motion.p key={s.optimizedRate} {...fade} className="text-2xl font-bold tabular-nums text-accent-400">{s.optimizedRate}</motion.p>
            </AnimatePresence>
            <p className="text-[9px] text-navy-100/35 mt-0.5">After 321 Swipe</p>
          </div>
        </div>

        {/* Fee breakdown */}
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-widest text-navy-100/35 mb-3">Fee breakdown</p>
          <div className="space-y-3">
            {s.fees.map((row, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <AnimatePresence mode="wait">
                    <motion.span key={row.label} {...fade} className="text-navy-100/60">{row.label}</motion.span>
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <motion.span key={row.amount} {...fade} className="font-semibold text-white tabular-nums">{row.amount}</motion.span>
                  </AnimatePresence>
                </div>
                <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    animate={{ width: `${row.pct}%` }}
                    initial={{ width: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: EASE }}
                    className="h-full rounded-full"
                    style={{ background: ["#2563eb", "#3b82f6", "#60a5fa"][i] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings callout */}
        <div
          className="rounded-xl p-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0.08) 100%)", border: "1px solid rgba(37,99,235,0.28)" }}
        >
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-accent-400/80 mb-1">Estimated monthly savings</p>
            <AnimatePresence mode="wait">
              <motion.p key={s.savings} {...fade} className="text-[26px] font-bold text-white tabular-nums leading-none">
                {s.savings}
                <span className="text-sm font-normal text-navy-100/40">/mo</span>
              </motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p key={s.note} {...fade} className="text-[10px] text-navy-100/45 mt-1">{s.note}</motion.p>
            </AnimatePresence>
          </div>
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-blue-200 shrink-0"
            style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.3)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
            </svg>
          </div>
        </div>

        {/* Footer row: scenario dots + CTA */}
        <div className="flex items-center justify-between pt-1 text-[11px]" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <span className="text-navy-100/35">Example figures · every real review is read by an analyst</span>
            <span className="flex gap-1 ml-1" aria-hidden>
              {scenarios.map((_, i) => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full transition-colors duration-300"
                  style={{ background: i === index ? "#3b82f6" : "rgba(255,255,255,0.15)" }}
                />
              ))}
            </span>
          </div>
          <a
            href="https://upload.321swipe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-400 font-semibold hover:text-accent-300 transition-colors"
          >
            Get yours →
          </a>
        </div>
      </div>
    </div>
  );
}
