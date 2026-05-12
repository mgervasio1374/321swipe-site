"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";

const pillars = [
  {
    number: "01",
    icon: "👤",
    title: "A Named Advisor. Not a Call Center.",
    body: "Every client gets a dedicated account manager who learns your business, your volume, and your goals. When you have a question, you call them — not a 1-800 number.",
  },
  {
    number: "02",
    icon: "📋",
    title: "Monthly Statement Reviews. Without Being Asked.",
    body: "We review your processor statement every month and bring the findings to you. New fees, rate changes, unusual activity — we catch it before it costs you.",
  },
  {
    number: "03",
    icon: "⚡",
    title: "Setup Done Right. Fast.",
    body: "We handle everything — equipment, integrations, testing. Most clients are live in under a week with zero downtime to their operations.",
  },
  {
    number: "04",
    icon: "📈",
    title: "Ongoing Strategy. Not a One-Time Sale.",
    body: "As your business grows, your payment strategy should evolve. We check in regularly and adjust your setup so you're never paying more than you should.",
  },
];

export function PartnershipSection() {
  return (
    <section id="partnership" className="relative py-24 lg:py-32 bg-white border-t border-slate-100">
      {/* Top gradient entry — smooths the dark-to-light transition from IntelligenceSection */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 inset-x-0 h-32"
        style={{ background: "linear-gradient(180deg, #0d1e3a 0%, #1e293b 18%, #94a3b8 38%, #f1f5f9 60%, #ffffff 80%)" }}
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
              Human partnership
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy-900 leading-[1.1] tracking-tight">
              Software can process payments.
              <br />
              <span className="text-slate-400 font-normal">It can&apos;t understand your business.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.18}>
            <p className="mt-6 text-base text-slate-500 leading-relaxed max-w-2xl">
              Every contractor we work with gets more than a payment processor.
              They get an advisor who picks up the phone, reviews their numbers
              every month, and proactively brings them savings — without being asked.
              That&apos;s a relationship most processors simply can&apos;t offer.
            </p>
          </ScrollReveal>
        </div>

        {/* ── Advisor visual + pillars ── */}
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-16 items-start">

          {/* Left: what's included in every account */}
          <ScrollReveal direction="left" className="lg:sticky lg:top-24">
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-0 rounded-2xl opacity-40 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 20%, #eef4fb 0%, transparent 70%)" }}
              />

              <div className="relative bg-surface rounded-2xl border border-slate-200 overflow-hidden">
                {/* Card header */}
                <div className="px-7 pt-7 pb-5 border-b border-slate-100">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                    Every account includes
                  </p>
                  <h3 className="text-base font-bold text-navy-900 leading-snug">
                    No call centers.
                    <br />
                    No tiers. No surprises.
                  </h3>
                </div>

                {/* Commitments list */}
                <div className="px-7 py-2">
                  {[
                    {
                      icon: (
                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                          <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm0 1a5 5 0 00-4.546 2.916A5.986 5.986 0 008 14a5.986 5.986 0 004.546-2.084A5 5 0 008 9z" />
                        </svg>
                      ),
                      title: "A dedicated account advisor",
                      detail: "A named person with a direct line — not a ticket queue.",
                    },
                    {
                      icon: (
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                          <path d="M2 4h12v9a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" />
                          <path d="M2 4l6 5 6-5" />
                        </svg>
                      ),
                      title: "Monthly statement review",
                      detail: "Every month, without you having to ask.",
                    },
                    {
                      icon: (
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                          <circle cx="8" cy="8" r="6" />
                          <path d="M8 5v3.5l2 1.5" />
                        </svg>
                      ),
                      title: "Same-day response",
                      detail: "On any business day. You won't sit on hold.",
                    },
                    {
                      icon: (
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                          <path d="M3 8h10M8 3l5 5-5 5" />
                        </svg>
                      ),
                      title: "Month-to-month terms",
                      detail: "No long-term contracts. Stay because it works.",
                    },
                    {
                      icon: (
                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                          <path d="M8 1a2 2 0 012 2v.5h1.5A1.5 1.5 0 0113 5v8.5A1.5 1.5 0 0111.5 15h-7A1.5 1.5 0 013 13.5V5a1.5 1.5 0 011.5-1.5H6V3a2 2 0 012-2zm0 1a1 1 0 00-1 1v.5h2V3a1 1 0 00-1-1zm2.5 3.5h-5A.5.5 0 005 6v6a.5.5 0 00.5.5h5A.5.5 0 0011 12V6a.5.5 0 00-.5-.5z" />
                        </svg>
                      ),
                      title: "Proactive savings identification",
                      detail: "We bring you the findings. You don't have to chase us.",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ delay: 0.08 + i * 0.07, duration: 0.4, ease: EASE }}
                      className="flex items-start gap-3.5 py-3.5 border-b border-slate-100 last:border-0"
                    >
                      <div className="w-6 h-6 rounded-md bg-accent-50 border border-accent-100/60 flex items-center justify-center text-accent-500 shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[12.5px] font-semibold text-navy-900 leading-none">{item.title}</p>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.detail}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer CTA */}
                <div className="px-7 pb-7 pt-4">
                  <button
                    onClick={() => window.dispatchEvent(new Event("open-lead-modal"))}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-accent-500 hover:text-accent-600 transition-colors"
                  >
                    See what a statement review looks like
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                      <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: pillars */}
          <div className="flex flex-col gap-6">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                whileHover={{ x: 4, transition: { duration: 0.2, ease: "easeOut" as const } }}
                className="group bg-white rounded-2xl border border-slate-200 p-6 flex gap-5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100 transition-shadow cursor-default"
              >
                <div className="shrink-0 pt-0.5">
                  <span className="text-2xl font-black text-slate-100 group-hover:text-navy-100 transition-colors select-none tabular-nums">
                    {pillar.number}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{pillar.icon}</span>
                    <h3 className="text-sm font-semibold text-navy-900">{pillar.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{pillar.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
