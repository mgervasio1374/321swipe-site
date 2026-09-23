"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SubpageHeader } from "@/app/components/navigation/SubpageHeader";
import { ClosingCta } from "@/app/components/sections/ClosingCta";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";
import { track } from "@/app/lib/analytics";
import { GROUPS, VERDICTS, feeBySlug, feesInGroup, money, type Fee } from "@/app/lib/fees";
import type { PhotoMap } from "@/app/lib/photos";

const openModal = () => window.dispatchEvent(new Event("open-lead-modal"));

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
});

export function FeePage({ fee, photos }: { fee: Fee; photos: PhotoMap }) {
  const v = VERDICTS[fee.verdict];
  const group = GROUPS.find((g) => g.id === fee.group)!;
  const siblings = feesInGroup(fee.group).filter((f) => f.slug !== fee.slug);
  const related = fee.related.map(feeBySlug).filter(Boolean) as Fee[];

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `What is a ${fee.label.toLowerCase()}?`, acceptedAnswer: { "@type": "Answer", text: fee.plainEnglish } },
      { "@type": "Question", name: `What should a ${fee.label.toLowerCase()} cost?`, acceptedAnswer: { "@type": "Answer", text: fee.typicalRange } },
      { "@type": "Question", name: `Can a ${fee.label.toLowerCase()} be removed or negotiated?`, acceptedAnswer: { "@type": "Answer", text: `${v.blurb} ${fee.whatWeDo}` } },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
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
            <motion.nav {...fade(0)} aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[12px] text-slate-400">
              <Link href="/" className="hover:text-navy-900 transition-colors">321 Swipe</Link>
              <span>/</span>
              <Link href="/fees" className="hover:text-navy-900 transition-colors">Fee dictionary</Link>
              <span>/</span>
              <span className="text-slate-500">{group.title}</span>
            </motion.nav>

            <div className="mt-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-end">
              <div>
                <motion.div {...fade(0.08)}>
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
                    style={{ color: v.color, background: v.bg, boxShadow: `inset 0 0 0 1px ${v.ring}` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: v.color }} />
                    {v.label}
                  </span>
                </motion.div>
                <motion.h1
                  {...fade(0.16)}
                  className="mt-5 font-bold tracking-[-0.038em] leading-[1.05] text-navy-900"
                  style={{ fontSize: "clamp(2.2rem, 4vw, 3.3rem)" }}
                >
                  {fee.label}
                </motion.h1>
                <motion.p {...fade(0.24)} className="mt-3 text-[12px] font-mono uppercase tracking-[0.06em] text-slate-400">
                  On a statement: {fee.statementLabel}
                </motion.p>
              </div>
              <motion.div {...fade(0.3)}>
                <p className="text-[1rem] text-slate-600 leading-[1.72]">{fee.plainEnglish}</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16">
            <div className="grid sm:grid-cols-2 gap-5">
              <ScrollReveal>
                <div className="h-full rounded-2xl bg-slate-50 border border-slate-200/80 p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">What a fair version looks like</p>
                  <p className="mt-3 text-[15px] text-navy-900 leading-relaxed">{fee.typicalRange}</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <div className="h-full rounded-2xl bg-navy-900 text-white p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-blue-300">What 321 Swipe would do</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-blue-50/90">{fee.whatWeDo}</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.16} className="sm:col-span-2">
                <div className="rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">See it on a statement</p>
                    <p className="mt-1.5 text-[15px] text-navy-900 leading-relaxed">
                      {fee.sampleAmount !== null ? (
                        <>
                          On our sample statement this line is <b className="tabular-nums">{money(fee.sampleAmount)}</b>
                          {fee.sampleDetail ? <span className="text-slate-500"> ({fee.sampleDetail})</span> : null}.
                        </>
                      ) : (
                        <>This isn&apos;t a monthly charge — it appears in the contract terms on our sample statement.</>
                      )}
                    </p>
                  </div>
                  <Link
                    href="/statement-decoder"
                    onClick={() => track({ name: "fee_page_to_decoder", fee: fee.slug })}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-navy-800 transition-colors whitespace-nowrap"
                  >
                    Open the Statement Decoder
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70">
                      <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            <div className="flex flex-col gap-8">
              {related.length > 0 && (
                <ScrollReveal>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Related fees</p>
                    <ul className="mt-3 divide-y divide-slate-100 border-y border-slate-100">
                      {related.map((r) => (
                        <li key={r.slug}>
                          <Link href={`/fees/${r.slug}`} className="group flex items-center justify-between gap-4 py-3">
                            <span className="flex items-center gap-2.5 text-[14px] font-medium text-navy-900 group-hover:text-accent-600 transition-colors">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: VERDICTS[r.verdict].color }} />
                              {r.label}
                            </span>
                            <span className="text-[11px] text-slate-400 shrink-0">{VERDICTS[r.verdict].short}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              )}
              {siblings.length > 0 && (
                <ScrollReveal delay={0.08}>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Also under {group.title.toLowerCase()}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {siblings.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/fees/${s.slug}`}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] text-slate-600 hover:border-navy-900 hover:text-navy-900 transition-colors"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                    <Link href="/fees" className="mt-4 inline-block text-[13px] font-semibold text-accent-600 hover:text-accent-500">
                      All fees →
                    </Link>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>

        <ClosingCta
          photo={photos["van-dusk"]}
          badge="Free statement review"
          title={<>Is this on your statement?</>}
          body="Send it and we'll tell you — along with everything else on there that shouldn't be. A phone photo of the fee page is enough."
          primary={{ label: "Request a statement review", href: "https://app.321swipe.com" }}
          trustPoints={["Free", "Nothing to sign", "An analyst reads it, not software"]}
        />
      </main>
    </>
  );
}
