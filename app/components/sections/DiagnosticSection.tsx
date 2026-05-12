"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";

const findings = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    title: "Markup Creep",
    body: "Processor markups that quietly increase after the original agreement — often without notice or explanation.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Hidden Monthly Fees",
    body: "PCI fees, batch fees, statement fees, and access fees that compound quietly and rarely get questioned.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
    ),
    title: "Interchange Downgrades",
    body: "Transactions routing at higher-cost interchange categories due to card type, missing data, or processor setup.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Funding Delays",
    body: "Deposits arriving slower than standard, creating unnecessary cash-flow drag on jobs that are already complete.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: "Payment Workflow Gaps",
    body: "Manual collection steps, missed invoice payments, or job and payment data that never connect.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    title: "Contract Traps",
    body: "Long-term terms, liquidated damages, auto-renewals, and cancellation fees buried in the original agreement.",
  },
];

const stats = [
  { value: "$250M+", label: "Processed annually" },
  { value: "300+",   label: "Contractor clients" },
  { value: "97%",    label: "Client retention" },
  { value: "Monthly", label: "Statement reviews" },
];

export function DiagnosticSection() {
  return (
    <section id="diagnostic" className="py-24 lg:py-32 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Stats strip */}
        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-100 mb-20 pb-16 border-b border-slate-100">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45, ease: EASE }}
                className="lg:px-8 first:pl-0 last:pr-0 flex flex-col"
              >
                <span className="text-3xl lg:text-4xl font-black text-navy-900 tracking-tight leading-none tabular-nums">
                  {s.value}
                </span>
                <span className="text-xs text-slate-400 mt-1.5 font-medium">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_1.55fr] gap-16 lg:gap-20 items-start">

          {/* Left — sticky explanatory panel */}
          <div className="lg:sticky lg:top-28">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                Statement review
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-[1.1] tracking-tight">
                What a 321 Swipe review actually finds.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-sm">
                Most contractors don&apos;t need another processor pitch. They need someone to
                translate the statement, identify the leaks, and explain what should change.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.24}>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm">
                Every 321 Swipe client gets a monthly review by a human analyst — not an
                algorithm. We flag what we find, explain it in plain English, and help you act on it.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.32}>
              <div className="mt-8">
                <a
                  href="https://upload.321swipe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-navy-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-navy-800 transition-colors"
                >
                  Get your free review
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70">
                    <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Right — 3×2 diagnostic grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {findings.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.08, duration: 0.45, ease: EASE }}
                className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-slate-300 hover:bg-white hover:shadow-sm transition-all cursor-default"
              >
                <div className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-accent-500 mb-3.5 group-hover:border-accent-200 group-hover:bg-accent-50 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-navy-900 mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
