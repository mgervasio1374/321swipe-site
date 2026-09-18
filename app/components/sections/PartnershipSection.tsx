"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { PhotoFrame } from "@/app/components/ui/PhotoFrame";
import { EASE } from "@/app/lib/animations";

const pillars = [
  {
    number: "01",
    title: "A named advisor. Not a call center.",
    body: "Every client gets a dedicated account manager who learns your business, your volume, and your goals. When you have a question, you call them — not a 1-800 number.",
  },
  {
    number: "02",
    title: "Monthly statement reviews. Without being asked.",
    body: "We review your processor statement every month and bring the findings to you. New fees, rate changes, unusual activity — we catch it before it costs you.",
  },
  {
    number: "03",
    title: "Setup done right. Fast.",
    body: "We handle everything — equipment, integrations, testing. Most clients are live in under a week with zero downtime to their operations.",
  },
  {
    number: "04",
    title: "Ongoing strategy. Not a one-time sale.",
    body: "As your business grows, your payment strategy should evolve. We check in regularly and adjust your setup so you're never paying more than you should.",
  },
];

const included = [
  { title: "A dedicated account advisor", detail: "A named person with a direct line — not a ticket queue." },
  { title: "Monthly statement review",     detail: "Every month, without you having to ask." },
  { title: "Same-day response",            detail: "On any business day. You won't sit on hold." },
  { title: "Month-to-month terms",         detail: "No term, no exit fee, no auto-renewal window to miss." },
];

const Check = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

interface Props {
  advisorPhoto: string | null;
  tailgatePhoto: string | null;
}

export function PartnershipSection({ advisorPhoto, tailgatePhoto }: Props) {
  return (
    <section id="partnership" className="relative py-24 lg:py-28 bg-surface border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Header row: copy + tailgate photo ── */}
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-10 items-center mb-10 lg:mb-12">
        <div className="max-w-3xl">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
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
              Every contractor we work with gets more than a payment processor. They get a named
              advisor who picks up the phone, reviews their numbers, and brings savings opportunities
              before they have to ask.
            </p>
          </ScrollReveal>
        </div>
          <ScrollReveal direction="right">
            <PhotoFrame
              src={tailgatePhoto}
              alt="An electrician and shop owner reviewing a tablet at the tailgate of their work van"
              brief="Wide: an electrician and the shop owner reviewing a tablet at the tailgate of a work van, early morning, job site behind."
              tone="light"
              motion="parallax"
              position="50% 25%"
              className="h-[240px] lg:h-[280px] rounded-[20px]"
              style={{ boxShadow: "0 24px 60px rgba(12,21,36,0.10)" }}
            />
          </ScrollReveal>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-10 items-stretch">

          {/* ── Left: advisor photo ── */}
          <ScrollReveal direction="left" className="h-full">
            <PhotoFrame
              src={advisorPhoto}
              alt="A 321 Swipe advisor on a call with a client, statement and notepad in front of her"
              brief="A 321 Swipe advisor on a headset call at a bright desk, statement and notepad in front of her, mid-explanation and smiling."
              tone="navy"
              motion="parallax"
              position="46% 35%"
              className="h-[440px] lg:h-full lg:min-h-[520px] rounded-[20px]"
              style={{ boxShadow: "0 24px 60px rgba(12,21,36,0.14)" }}
            />
          </ScrollReveal>

          {/* ── Right: what's included + pillars ── */}
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              <div className="px-6 pt-5 pb-3.5 border-b border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Every account includes</p>
                <span className="text-[10px] font-semibold text-accent-500 bg-accent-50 px-2 py-0.5 rounded-full">No extra cost</span>
              </div>
              <div className="px-6 py-1.5 grid sm:grid-cols-2 sm:gap-x-8">
                {included.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 py-3">
                    <span className="w-6 h-6 rounded-md bg-accent-50 text-accent-500 flex items-center justify-center shrink-0 mt-0.5">
                      {Check}
                    </span>
                    <div>
                      <p className="text-[12.5px] font-semibold text-navy-900 leading-none">{item.title}</p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: EASE }}
                whileHover={{ x: 4, transition: { duration: 0.2, ease: "easeOut" as const } }}
                className="group bg-white rounded-2xl border border-slate-200 p-6 flex gap-5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100 transition-shadow cursor-default"
              >
                <span className="shrink-0 text-2xl font-black text-navy-100 group-hover:text-accent-400 transition-colors select-none tabular-nums leading-none pt-0.5">
                  {pillar.number}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-navy-900 mb-1.5">{pillar.title}</h3>
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
