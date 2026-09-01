"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";

const problems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Unclear Fee Statements",
    body: "Interchange-plus, flat rate, tiered pricing — most contractors can't decode their own statement. Every month a mystery.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
        <path d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
      </svg>
    ),
    title: "Disconnected Systems",
    body: "Payment data lives in one place, job costs in another, cash in a third. Nothing connects. Decisions get made blind.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Slow Collections",
    body: "Paper checks, net-30 terms, and manual follow-ups. Cash flow suffers while you wait for money already earned.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 3l18 18M10.5 10.677a2 2 0 002.823 2.823M7.362 7.561A7.03 7.03 0 0012 6c3.866 0 7 3.134 7 7a7.03 7.03 0 01-.44 2.458M6.228 6.228A10.45 10.45 0 003 13c0 5.796 4.685 10.498 10.5 10.498" />
        <path d="M9.773 9.773A4 4 0 0112 9c2.21 0 4 1.79 4 4 0 0 0-1.773 2.227" />
      </svg>
    ),
    title: "Limited Visibility",
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

export function ProblemSection() {
  return (
    <section id="problems" className="py-24 lg:py-32 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
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
            <p className="mt-4 text-base text-slate-500 leading-relaxed">
              Most processors make it difficult to understand what you are really paying.
              Confusing statements, disconnected systems, slow collections, and limited visibility
              quietly cost contractors money every month.
            </p>
          </ScrollReveal>
        </div>

        {/* Problem cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" as const } }}
              className="group relative bg-white rounded-2xl border border-slate-200 p-6 cursor-default transition-shadow hover:shadow-lg hover:shadow-slate-100 hover:border-slate-300"
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4 group-hover:bg-navy-50 group-hover:text-navy-700 transition-colors duration-200">
                {problem.icon}
              </div>
              <h3 className="text-sm font-semibold text-navy-900 mb-2">{problem.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{problem.body}</p>

              {/* Subtle bottom accent on hover */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
