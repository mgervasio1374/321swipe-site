"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SubpageHeader } from "@/app/components/navigation/SubpageHeader";
import { ClosingCta } from "@/app/components/sections/ClosingCta";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";
import { FEES, GROUPS, VERDICTS, feesInGroup, money, type Verdict } from "@/app/lib/fees";
import type { PhotoMap } from "@/app/lib/photos";

const openModal = () => window.dispatchEvent(new Event("open-lead-modal"));

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
});

export function FeeIndexPage({ photos }: { photos: PhotoMap }) {
  return (
    <>
      <SubpageHeader label="Fee dictionary" cta={{ label: "Decode my statement", onClick: openModal }} />

      <main>
        <section
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(130deg, #f9fbfe 0%, #f1f5f9 40%, #f9fbfe 100%)" }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, rgba(12,21,36,0.07) 1.2px, transparent 1.2px)", backgroundSize: "40px 40px", opacity: 0.22 }}
          />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-14 lg:pt-32 lg:pb-16">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-end">
              <div>
                <motion.div {...fade(0.05)}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50/90 px-3.5 py-1.5 text-xs font-semibold text-navy-700 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                    Fee dictionary
                  </span>
                </motion.div>
                <motion.h1
                  {...fade(0.15)}
                  className="mt-6 max-w-[18ch] font-bold tracking-[-0.038em] leading-[1.05] text-navy-900"
                  style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)" }}
                >
                  {FEES.length} fees, in plain English.
                </motion.h1>
              </div>
              <motion.div {...fade(0.28)}>
                <p className="text-[1rem] text-slate-500 leading-[1.72] max-w-[440px]">
                  Every line you&apos;re likely to find on a processing statement — what it is, whether it&apos;s
                  real cost or processor margin, and what a fair version looks like for a home-service
                  contractor.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
                  {(Object.keys(VERDICTS) as Verdict[]).map((k) => (
                    <span key={k} className="inline-flex items-center gap-1.5 text-[12px] text-slate-500">
                      <span className="w-2 h-2 rounded-full" style={{ background: VERDICTS[k].color }} />
                      {VERDICTS[k].label}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-12">
            {GROUPS.map((g, gi) => (
              <ScrollReveal key={g.id} delay={0.04 * gi}>
                <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6 lg:gap-16">
                  <div>
                    <h2 className="text-[22px] font-bold text-navy-900 tracking-tight leading-tight">{g.title}</h2>
                    <p className="mt-2 text-[14px] text-slate-500 leading-relaxed max-w-sm">{g.blurb}</p>
                  </div>
                  <ul className="divide-y divide-slate-100 border-y border-slate-100">
                    {feesInGroup(g.id).map((f) => (
                      <li key={f.slug}>
                        <Link href={`/fees/${f.slug}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-3.5">
                          <span className="w-2 h-2 rounded-full" style={{ background: VERDICTS[f.verdict].color }} />
                          <span className="min-w-0">
                            <span className="block text-[15px] font-medium text-navy-900 group-hover:text-accent-600 transition-colors">{f.label}</span>
                            <span className="block text-[12.5px] text-slate-400 truncate">{f.plainEnglish.split(". ")[0]}.</span>
                          </span>
                          <span className="text-[12px] text-slate-400 tabular-nums font-mono whitespace-nowrap">
                            {f.sampleAmount !== null ? money(f.sampleAmount) : "terms"}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}

            <ScrollReveal>
              <div className="rounded-2xl bg-navy-50 border border-navy-100 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy-700/70">See them all in context</p>
                  <p className="mt-1.5 text-[17px] font-semibold text-navy-900 tracking-tight">
                    The Statement Decoder shows every one of these on a real-looking statement.
                  </p>
                </div>
                <Link
                  href="/statement-decoder"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-navy-800 transition-colors whitespace-nowrap"
                >
                  Open the decoder
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <ClosingCta
          photo={photos["van-dusk"]}
          badge="Free statement review"
          title="Now decode yours."
          body="Send one recent statement — a photo from your phone is fine. We'll mark up every line, total what's avoidable, and tell you plainly what to do next."
          primary={{ label: "Request a statement review", href: "https://upload.321swipe.com" }}
          trustPoints={["No obligation", "Nothing to install", "Reviewed by a person, not a form", "Month-to-month if you switch"]}
        />
      </main>
    </>
  );
}
