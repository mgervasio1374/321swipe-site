"use client";

import { motion } from "framer-motion";
import { SubpageHeader } from "@/app/components/navigation/SubpageHeader";
import { ClosingCta } from "@/app/components/sections/ClosingCta";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";
import { TOTALS, money } from "@/app/lib/fees";
import type { PhotoMap } from "@/app/lib/photos";
import { StatementDecoder } from "./StatementDecoder";

const openModal = () => window.dispatchEvent(new Event("open-lead-modal"));

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
});

const takeaways = [
  {
    title: "Two-thirds of the statement is real cost.",
    body: `Interchange and assessments — ${money(TOTALS.passThrough)} here — go to the card brands and the customer's bank. No processor can lower them. Anyone who says otherwise is moving the number somewhere else on the page.`,
  },
  {
    title: "The rest is the conversation.",
    body: `${money(TOTALS.markup)} of processor markup is legitimate but negotiable. ${money(TOTALS.avoidable)} is junk: penalties, made-up fees and downgrades. That's ${money(Math.round(TOTALS.annualAvoidable)).replace('.00', '')} a year on one account.`,
  },
  {
    title: "The biggest line isn't a fee at all.",
    body: "Tiered pricing turns a fair-looking rate into a small share of your sales, then surcharges the rest. Moving to interchange-plus removes the tiers — and usually more money than every junk fee combined.",
  },
];

export function StatementDecoderPage({ photos }: { photos: PhotoMap }) {
  return (
    <>
      <SubpageHeader label="Statement Decoder" cta={{ label: "Decode my statement", onClick: openModal }} />

      <main>
        {/* ── Hero: short, copy-led; the statement itself is the visual ── */}
        <section
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(130deg, #f9fbfe 0%, #f1f5f9 40%, #f9fbfe 100%)" }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, rgba(12,21,36,0.07) 1.2px, transparent 1.2px)", backgroundSize: "40px 40px", opacity: 0.22 }}
          />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-10 lg:pt-32 lg:pb-14">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-end">
              <div>
                <motion.div {...fade(0.05)}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50/90 px-3.5 py-1.5 text-xs font-semibold text-navy-700 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                    Statement Decoder
                  </span>
                </motion.div>
                <motion.h1
                  {...fade(0.15)}
                  className="mt-6 max-w-[20ch] font-bold tracking-[-0.038em] leading-[1.05] text-navy-900"
                  style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)" }}
                >
                  Every line on a processor statement,{" "}
                  <span
                    style={{
                      background: "linear-gradient(125deg, #1a3ed4 0%, #2563eb 40%, #60a5fa 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    explained.
                  </span>
                </motion.h1>
              </div>
              <motion.div {...fade(0.28)} className="lg:pb-2">
                <p className="text-[1rem] text-slate-500 leading-[1.72] max-w-[440px]">
                  A realistic statement for a roofing company on a tiered plan. Hover or tap any line to see
                  what it is, what a fair version looks like, and what we&apos;d do about it. Then flip the
                  switch to see what we&apos;d flag.
                </p>
                <p className="mt-4 text-[12px] text-slate-400">
                  Fictional business, real fee structure. Amounts are typical for ~{money(82000).replace(".00", "")}/month in card volume.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── The decoder ── */}
        <section id="decoder" className="relative pb-20 lg:pb-28 bg-surface">
          {/* the hero gradient runs a little way behind the statement so it reads as paper on a desk */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-32" style={{ background: "linear-gradient(180deg, #f1f5f9 0%, transparent 100%)" }} />
          <motion.div {...fade(0.4)} className="relative pt-2">
            <StatementDecoder />
          </motion.div>
        </section>

        {/* ── Three takeaways ── */}
        <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                What this statement teaches
              </span>
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {takeaways.map((t, i) => (
                <ScrollReveal key={t.title} delay={0.08 * i}>
                  <div className="h-full rounded-2xl border border-slate-200 p-6 bg-white">
                    <span className="text-[11px] font-mono text-accent-500">0{i + 1}</span>
                    <h3 className="mt-2 text-[17px] font-bold text-navy-900 leading-snug tracking-tight">{t.title}</h3>
                    <p className="mt-3 text-[14px] text-slate-500 leading-relaxed">{t.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <ClosingCta
          photo={photos["van-dusk"]}
          badge="Free statement review"
          title="Now decode yours."
          body="Send one recent statement — a photo from your phone is fine. Within a few business days you'll get it back marked up exactly like this one: every line labeled, every avoidable fee totaled, and a plain answer on what to do next."
          primary={{ label: "Request a statement review", href: "https://upload.321swipe.com" }}
          trustPoints={["No obligation", "Nothing to install", "Reviewed by a person, not a form", "Month-to-month if you switch"]}
        />
      </main>
    </>
  );
}
