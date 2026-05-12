"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useEffect, useState } from "react";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";

// ── Stat counter ──────────────────────────────────────────────────────────────
function StatCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 1800,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{val.toLocaleString()}{suffix}
    </span>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const stats = [
  { label: "Processed annually", value: 250, prefix: "$", suffix: "M+", desc: "in contractor payments" },
  { label: "Contractor clients", value: 300, prefix: "", suffix: "+", desc: "active businesses" },
  { label: "Avg. monthly savings", value: 480, prefix: "$", suffix: "", desc: "per client found" },
  { label: "Client retention", value: 97, prefix: "", suffix: "%", desc: "year-over-year" },
];

const testimonials = [
  {
    quote: "We were paying 3.8% effective and had no idea. 321 Swipe found over $600 a month in savings on the first review. That paid for itself immediately.",
    name: "Mike H.",
    role: "Owner",
    company: "Roofing Contractor",
    location: "Phoenix, AZ",
    trade: "Roofing",
    initials: "MH",
    color: "from-blue-500 to-blue-700",
  },
  {
    quote: "The statement review alone is worth it. But what I actually value is that Bruce picks up the phone. That's not something I've had with any other processor.",
    name: "Sarah C.",
    role: "Controller",
    company: "Plumbing Contractor",
    location: "Dallas, TX",
    trade: "Plumbing",
    initials: "SC",
    color: "from-teal-500 to-teal-700",
  },
  {
    quote: "Finally a payment company that gets what it's like to run jobs in the field. They set up everything in a week. No headaches, no surprises.",
    name: "David O.",
    role: "Owner",
    company: "HVAC Contractor",
    location: "Nashville, TN",
    trade: "HVAC",
    initials: "DO",
    color: "from-slate-500 to-slate-700",
  },
];

const verticals = [
  "Roofing", "HVAC", "Plumbing", "Electrical",
  "Landscaping", "Solar", "General Contracting", "Pest Control",
];

// ── Component ─────────────────────────────────────────────────────────────────
export function SocialProofSection() {
  return (
    <section id="proof" className="py-24 lg:py-32 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Stats bar ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 mb-20 lg:divide-x lg:divide-slate-100">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
              className="flex flex-col lg:px-8 first:pl-0 last:pr-0"
            >
              <span className="text-4xl lg:text-5xl font-black text-navy-900 leading-none tracking-tight">
                <StatCounter
                  target={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </span>
              <span className="text-sm font-semibold text-navy-900 mt-2">{stat.label}</span>
              <span className="text-xs text-slate-400 mt-0.5">{stat.desc}</span>
            </motion.div>
          ))}
        </div>

        {/* ── Section label ── */}
        <div className="max-w-xl mb-12">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-5">
              Contractor voices
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 leading-tight tracking-tight">
              Contractors across the trades.{" "}
              <span className="text-slate-400 font-normal">One consistent result.</span>
            </h2>
          </ScrollReveal>
        </div>

        {/* ── Testimonials ── */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: EASE }}
              whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" as const } }}
              className="group bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 transition-shadow cursor-default"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Attribution */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy-900">{t.name} · {t.role}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.company} · {t.location}</p>
                </div>
                <span className="ml-auto text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full shrink-0">
                  {t.trade}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Industry verticals + CertainPath ── */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-6 border-y border-slate-100">
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {verticals.map((v) => (
                <span key={v} className="text-xs font-medium text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full hover:text-slate-600 hover:border-slate-200 transition-colors">
                  {v}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2.5 shrink-0 text-sm">
              <div className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-white">
                  <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                Trusted by{" "}
                <span className="text-navy-900 font-semibold">CertainPath</span>
                {" "}members
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
