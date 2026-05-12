"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Payment Analytics",
    body: "See your true effective rate, fee trends, and processing costs in one clear view — not buried in a 12-page statement.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Statement Review",
    body: "Every month, a real analyst reviews your processor statement and tells you exactly what you're being charged — and what you shouldn't be.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Savings Identification",
    body: "We tell you the exact dollar amount you're overpaying — not a vague percentage. Then we fix it.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "Cash Flow Clarity",
    body: "Know exactly when money hits your account after the job is done — and why deposits sometimes come up short.",
  },
];

const feeRows = [
  { label: "Interchange Pass-Through", amount: "$1,440", pct: 75, color: "#2563eb" },
  { label: "Processor Markup", amount: "$680", pct: 46, color: "#3b82f6" },
  { label: "Hidden Markup Fees", amount: "$400", pct: 26, color: "#60a5fa" },
];

export function IntelligenceSection() {
  return (
    <section
      id="intelligence"
      className="relative py-28 lg:py-36 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #ffffff 0%, #f1f5f9 5%, #94a3b8 14%, #1e293b 26%, #0d1e3a 38%, #060d1c 52%)" }}
    >
      {/* Multi-layer glow system */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 20% 50%, rgba(37,99,235,0.14) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 85% 20%, rgba(30,64,128,0.22) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 40% 40% at 70% 80%, rgba(37,99,235,0.08) 0%, transparent 55%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* ── Left: text + features ── */}
          <div>
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-navy-700/60 bg-navy-800/40 px-3.5 py-1.5 text-xs font-semibold text-navy-100/90 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
                Verian Intelligence Platform
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-tight">
                Understand what your processing
                <br />
                <span className="text-accent-400">is actually costing you.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.16}>
              <p className="mt-5 text-[15px] text-navy-100/70 leading-relaxed max-w-lg">
                Verian is 321 Swipe&apos;s payment intelligence platform. It turns processor
                statements into plain-English insights, clear fee visibility, and concrete
                savings opportunities.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.22}>
              <p className="mt-3 text-[13px] text-navy-100/50 leading-relaxed max-w-lg">
                No black-box reports. No confusing fee codes. Just a clear view of what
                you are paying, why it changed, and what to fix.
              </p>
            </ScrollReveal>

            <div className="mt-10 flex flex-col gap-5">
              {features.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.12 + i * 0.1, duration: 0.45, ease: EASE }}
                  className="flex gap-4 group"
                >
                  <div className="shrink-0 w-8 h-8 rounded-lg border border-navy-700/60 bg-navy-800/50 flex items-center justify-center text-accent-400 group-hover:border-accent-500/50 group-hover:bg-accent-500/10 transition-all duration-200">
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-0.5">{feat.title}</h3>
                    <p className="text-[13px] text-navy-100/65 leading-relaxed">{feat.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Verian badge */}
            <ScrollReveal delay={0.55}>
              <div className="mt-10 inline-flex items-center gap-3 rounded-xl border border-navy-700/50 bg-navy-800/30 px-4 py-3">
                <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                <div>
                  <p className="text-[11px] font-semibold text-white leading-none">Powered by Verian Intelligence</p>
                  <p className="text-[10px] text-navy-100/50 mt-0.5">Exclusive to 321 Swipe clients</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ── Right: analysis card ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.18, ease: EASE }}
            className="relative"
          >
            {/* Deep glow behind card */}
            <div
              aria-hidden
              className="absolute -inset-8 rounded-[2rem] blur-3xl opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(ellipse, #3b82f6 0%, #2563eb 40%, transparent 70%)" }}
            />

            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #0f1e3a 0%, #0c1524 100%)",
                boxShadow: "0 0 0 1px rgba(37,99,235,0.2), 0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Card header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid rgba(37,99,235,0.15)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <p className="text-xs font-semibold text-white leading-none">Statement Analysis</p>
                    <p className="text-[10px] text-navy-100/40 mt-0.5">Apex Roofing LLC · May 2026</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
                  Analysis Complete
                </span>
              </div>

              <div className="p-5 space-y-5">
                {/* Rate comparison */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Your Effective Rate", value: "3.15%", sub: "Current processor", accent: false },
                    { label: "Optimized Rate", value: "2.35%", sub: "After 321 Swipe", accent: true },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl p-3.5"
                      style={{
                        background: item.accent
                          ? "linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0.06) 100%)"
                          : "rgba(255,255,255,0.03)",
                        border: item.accent
                          ? "1px solid rgba(37,99,235,0.25)"
                          : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <p className="text-[9px] font-semibold uppercase tracking-widest text-navy-100/45 mb-1">{item.label}</p>
                      <p className={`text-2xl font-bold tabular-nums ${item.accent ? "text-accent-400" : "text-white"}`}>
                        {item.value}
                      </p>
                      <p className="text-[9px] text-navy-100/35 mt-0.5">{item.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Fee breakdown bars */}
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-navy-100/35 mb-3">
                    Fee Breakdown
                  </p>
                  <div className="space-y-3">
                    {feeRows.map((row, i) => (
                      <div key={row.label} className="space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-navy-100/60">{row.label}</span>
                          <span className="font-semibold text-white tabular-nums">{row.amount}</span>
                        </div>
                        <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${row.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.35 + i * 0.13, duration: 0.8, ease: EASE }}
                            className="h-full rounded-full"
                            style={{ background: row.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Savings callout */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.65, duration: 0.4, ease: EASE }}
                  className="rounded-xl p-4 flex items-center justify-between"
                  style={{
                    background: "linear-gradient(135deg, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0.08) 100%)",
                    border: "1px solid rgba(37,99,235,0.28)",
                  }}
                >
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-accent-400/80 mb-1">
                      Estimated Monthly Savings
                    </p>
                    <p className="text-[26px] font-bold text-white tabular-nums leading-none">
                      $640
                      <span className="text-sm font-normal text-navy-100/40">/mo</span>
                    </p>
                    <p className="text-[10px] text-navy-100/45 mt-1">5 hidden fees identified · 0.80% rate reduction</p>
                  </div>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.3)" }}
                  >
                    💡
                  </div>
                </motion.div>

                {/* Micro action row */}
                <div
                  className="flex items-center justify-between pt-1 text-[11px]"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span className="text-navy-100/35">Report generated May 11, 2026</span>
                  <span className="text-accent-400 font-semibold cursor-pointer hover:text-accent-300 transition-colors">
                    View full report →
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient bridge — dark navy fades into the white Partnership section */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 inset-x-0 h-28"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(6,13,28,0.6) 40%, #060d1c 100%)",
        }}
      />
      {/* White fade at very bottom — merges with the next section's white bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 inset-x-0 h-12"
        style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.04) 100%)" }}
      />
    </section>
  );
}
