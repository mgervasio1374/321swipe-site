"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";

const advantages = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9a12.02 12.02 0 00-.382-3.016z" />
      </svg>
    ),
    label: "Independent",
    title: "No PE ownership. No quarterly targets.",
    body: "We're not owned by private equity. Our decisions are driven by what's right for contractors — not by fund returns or acquisition multiples.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
    ),
    label: "Contractor-first",
    title: "Built around how you actually work.",
    body: "Home service businesses have unique cash flow cycles, job-level costs, and field payment needs. We designed every product for that reality.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
      </svg>
    ),
    label: "Relationship-driven",
    title: "A real person who knows your business.",
    body: "Not a call center. Not a chatbot. A dedicated account manager who reviews your statements, spots issues, and proactively brings you savings.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: "Nimble by design",
    title: "We move at the speed of your business.",
    body: "No approval chains, no bureaucracy. When you need something changed, answered, or fixed — it gets done. That's the independent difference.",
  },
];

export function AdvantageSection() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-surface border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.8fr] gap-16 items-start">

          {/* Left: sticky text */}
          <div className="lg:sticky lg:top-28">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50 px-3.5 py-1.5 text-xs font-semibold text-navy-700 mb-6">
                Why 321 Swipe
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-tight tracking-tight">
                Not backed by private equity.{" "}
                <span className="text-accent-500">Built for contractors.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-sm">
                The largest payment processors are PE-owned and optimized for
                margin. We&apos;re optimized for contractor outcomes — which means
                lower costs, real transparency, and genuine relationships.
              </p>
            </ScrollReveal>

            {/* Trust metrics */}
            <ScrollReveal delay={0.24}>
              <div className="mt-10 flex flex-col gap-5">
                {[
                  { stat: "$0", label: "Setup or cancellation fees" },
                  { stat: "No", label: "Long-term contracts, ever" },
                  { stat: "97%", label: "Client retention rate" },
                ].map((item) => (
                  <div key={item.label} className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-navy-900 tabular-nums">
                      {item.stat}
                    </span>
                    <span className="text-sm text-slate-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right: advantage cards */}
          <div className="flex flex-col gap-5">
            {advantages.map((adv, i) => (
              <motion.div
                key={adv.label}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                whileHover={{ x: 4, transition: { duration: 0.2, ease: "easeOut" as const } }}
                className="group bg-white rounded-2xl border border-slate-200 p-6 flex gap-5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100 transition-shadow cursor-default"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center text-navy-700 group-hover:bg-navy-900 group-hover:text-white transition-colors duration-300">
                  {adv.icon}
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-500 block mb-1">
                    {adv.label}
                  </span>
                  <h3 className="text-sm font-semibold text-navy-900 mb-1.5">{adv.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{adv.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
