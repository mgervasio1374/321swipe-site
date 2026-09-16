"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { PhotoFrame } from "@/app/components/ui/PhotoFrame";
import { EASE } from "@/app/lib/animations";

const fits = [
  { kicker: "Regulated products", label: "Pharma, medical devices, licensed categories" },
  { kicker: "High average ticket", label: "$5k–$50k transactions that draw extra scrutiny" },
  { kicker: "No processing history", label: "New entities and first moves direct to market" },
  { kicker: "Volume in spikes", label: "Launches, seasonality, quarter-end concentration" },
];

const workstreams = ["Readiness & gap analysis", "Program design", "Benchmarking & negotiation", "Go-live & limit monitoring"];

/** Homepage section pointing to /advisory — for businesses whose problem is approval, not rate. */
export function AdvisorySection({ photo }: { photo: string | null }) {
  return (
    <section id="advisory" className="py-24 lg:py-28 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-center">

          <div>
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50 px-3.5 py-1.5 text-xs font-semibold text-navy-700 mb-6">
                Merchant advisory
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-[1.1] tracking-tight">
                Some businesses don&apos;t have a rate problem.{" "}
                <span className="text-accent-500">They have an approval problem.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-lg">
                High tickets, regulated products, no processing history, volume that arrives in spikes. When a
                business looks unusual to underwriting, the answer is often no — or a yes wrapped in caps and
                reserves. 321 Swipe prepares the file, translates what processors are asking for, and stays on
                the account after go-live.
              </p>
            </ScrollReveal>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {fits.map((f, i) => (
                <motion.div
                  key={f.kicker}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.45, ease: EASE }}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-accent-500">{f.kicker}</p>
                  <p className="mt-1 text-[13px] font-medium text-navy-900 leading-snug">{f.label}</p>
                </motion.div>
              ))}
            </div>

            <ScrollReveal delay={0.4}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/advisory"
                  className="inline-flex items-center gap-2 rounded-lg bg-navy-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-navy-800 transition-colors"
                >
                  Explore merchant advisory
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70">
                    <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                  </svg>
                </Link>
                <span className="text-xs text-slate-400">Retained engagements · NDA before anything is shared</span>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="right">
            <div className="relative">
              <PhotoFrame
                src={photo}
                alt="A 321 Swipe analyst preparing an underwriting file at a dual-monitor desk"
                brief="Over-the-shoulder: an analyst at a dual-monitor desk, statement on screen annotated in blue. Dark office, monitor glow."
                tone="navy"
                motion="parallax"
                position="55% 40%"
                className="h-[300px] sm:h-[420px] lg:h-[520px] rounded-[20px]"
                style={{ boxShadow: "0 24px 60px rgba(12,21,36,0.14)" }}
              />
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                className="relative -mt-10 mx-auto w-[min(92%,320px)] lg:absolute lg:mt-0 lg:mx-0 lg:w-[280px] lg:right-6 lg:bottom-6 bg-white rounded-[14px] p-4"
                style={{ boxShadow: "0 16px 48px rgba(12,21,36,0.16), 0 0 0 1px rgba(12,21,36,0.06)" }}
              >
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">Four workstreams</p>
                <div className="mt-2.5 flex flex-col gap-2">
                  {workstreams.map((w, i) => (
                    <div key={w} className="flex items-center gap-2.5 text-[12px] text-navy-900 font-medium">
                      <span className="w-5 h-5 rounded-full bg-accent-50 text-accent-500 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      {w}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
