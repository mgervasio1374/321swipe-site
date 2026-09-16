"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { PhotoFrame } from "@/app/components/ui/PhotoFrame";
import { EASE } from "@/app/lib/animations";

const problems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Unclear fee statements",
    body: "Interchange-plus, flat rate, tiered pricing — most contractors can't decode their own statement.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
        <path d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
      </svg>
    ),
    title: "Disconnected systems",
    body: "Payment data in one place, job costs in another, cash in a third. Decisions get made blind.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Slow collections",
    body: "Paper checks, net-30 terms, and manual follow-ups. Cash flow suffers while you wait for money already earned.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M3 3l18 18" />
      </svg>
    ),
    title: "Limited visibility",
    body: "No real-time view of effective rates, trends, or processing costs. You can't improve what you can't see.",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: EASE },
  }),
};

const flagged = [
  { label: "PCI non-compliance fee",     amount: "$39.95" },
  { label: "Batch header fee ×22",       amount: "$5.50" },
  { label: "Regulatory product fee",     amount: "$14.95" },
  { label: "Non-qual surcharge 1.90%",   amount: "$312.40" },
];

export function ProblemSection({ photo }: { photo: string | null }) {
  return (
    <section id="problems" className="py-24 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">

          {/* ── Photo with overlapping statement card ── */}
          <ScrollReveal direction="left">
            <div className="relative">
              <PhotoFrame
                src={photo}
                alt="A plumbing company owner reading a long processor statement at his shop desk"
                brief="Plumbing company owner at a cluttered shop desk holding a multi-page processor statement, reading glasses pushed up. Morning light."
                tone="light"
                motion="parallax"
                position="38% 50%"
                className="h-[300px] sm:h-[420px] lg:h-[560px] rounded-[20px]"
                style={{ boxShadow: "0 24px 60px rgba(12,21,36,0.12)" }}
              />
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                className="relative -mt-10 mx-auto w-[min(92%,300px)] lg:absolute lg:mt-0 lg:mx-0 lg:left-6 lg:top-6 lg:w-[230px] bg-white rounded-[14px] p-4"
                style={{ boxShadow: "0 16px 48px rgba(12,21,36,0.16), 0 0 0 1px rgba(12,21,36,0.06)" }}
              >
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">Statement · page 7 of 12</p>
                <div className="mt-2.5 flex flex-col gap-1.5 text-[11px] text-slate-600">
                  {flagged.map((f) => (
                    <div key={f.label} className="flex justify-between gap-3">
                      <span>{f.label}</span>
                      <b className="text-red-600 tabular-nums">{f.amount}</b>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200 flex justify-between text-[11px]">
                  <span className="text-slate-400">Flagged this month</span>
                  <b className="text-navy-900 tabular-nums">$372.80</b>
                </div>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* ── Copy + cards ── */}
          <div>
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                The status quo
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-tight tracking-tight">
                Payments shouldn&apos;t be this complicated.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <p className="mt-4 text-base text-slate-500 leading-relaxed max-w-lg">
                Most processors make it hard to understand what you&apos;re really paying. Confusing
                statements, disconnected systems, slow collections, and no visibility quietly cost
                contractors money every month.
              </p>
            </ScrollReveal>

            <div className="mt-9 grid sm:grid-cols-2 gap-4">
              {problems.map((problem, i) => (
                <motion.div
                  key={problem.title}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" as const } }}
                  className="group relative bg-white rounded-2xl border border-slate-200 p-5 cursor-default transition-shadow hover:shadow-lg hover:shadow-slate-100 hover:border-slate-300"
                >
                  <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-700 mb-3.5 group-hover:bg-navy-900 group-hover:text-white transition-colors duration-200">
                    {problem.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-navy-900 mb-1.5">{problem.title}</h3>
                  <p className="text-[13.5px] text-slate-500 leading-relaxed">{problem.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
