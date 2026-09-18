"use client";

import { motion } from "framer-motion";
import { SubpageHeader } from "@/app/components/navigation/SubpageHeader";
import { SplitPhotoHero } from "@/app/components/hero/SplitPhotoHero";
import { AdvisorySection } from "@/app/components/sections/AdvisorySection";
import { ClosingCta } from "@/app/components/sections/ClosingCta";
import { PhotoFrame } from "@/app/components/ui/PhotoFrame";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";
import type { PhotoMap } from "@/app/lib/photos";
import { RepForm } from "./RepForm";
import type { Rep } from "@/app/lib/reps";

// ── Helpers ───────────────────────────────────────────────────────────────────
const goToForm = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });

// ── Data ──────────────────────────────────────────────────────────────────────
const stepsFor = (n: string) => [
  { n: "01", title: `Send ${n} one statement`, body: "The most recent one is fine — a phone photo of the fee page works. Nothing to sign, nothing to install." },
  { n: "02", title: "A real walkthrough", body: "In person if you're nearby, or by phone. Every line explained, every avoidable fee totaled, in plain English." },
  { n: "03", title: "Switch only if the numbers say so", body: `If your current setup is fair, ${n} will tell you. If it isn't, ${n} moves you over on month-to-month terms and stays on the account.` },
];

// ── Hero visual: a recent review card ────────────────────────────────────────
function ReviewCard({ rep }: { rep: Rep }) {
  const { lines } = rep.example;
  return (
    <div className="relative select-none">
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}>
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 0 0 1px rgba(12,21,36,0.06), 0 16px 48px rgba(12,21,36,0.18), 0 40px 90px rgba(37,99,235,0.12)" }}
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <div>
              <p className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-[0.08em]">Example review</p>
              <p className="text-[13px] font-bold text-navy-900 mt-0.5">{rep.example.business}</p>
            </div>
            <span className="text-[10px] font-semibold text-accent-600 bg-accent-50 border border-accent-100 px-2.5 py-1 rounded-full">Marked up by {rep.firstName}</span>
          </div>
          <div className="p-5">
            <div className="flex flex-col gap-2 text-[12px]">
              {lines.map((l) => (
                <div key={l.label} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className={`w-1.5 h-1.5 rounded-full ${l.flag ? "bg-red-500" : "bg-emerald-500"}`} />
                    {l.label}
                  </span>
                  <b className={`tabular-nums ${l.flag ? "text-red-600" : "text-slate-700"}`}>{l.amount}</b>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl p-3 bg-slate-50 border border-slate-200">
                <p className="text-[8.5px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Effective rate</p>
                <p className="text-[20px] font-bold tabular-nums leading-none text-slate-700">{rep.example.before}</p>
                <p className="text-[8.5px] text-slate-400 mt-0.5">Before</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.18)" }}>
                <p className="text-[8.5px] font-semibold uppercase tracking-widest text-slate-400 mb-1">After review</p>
                <p className="text-[20px] font-bold tabular-nums leading-none text-accent-600">{rep.example.after}</p>
                <p className="text-[8.5px] text-slate-400 mt-0.5">{rep.example.saving}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function RepPage({ rep, photos }: { rep: Rep; photos: PhotoMap }) {
  const industries = rep.industries;
  const steps = stepsFor(rep.firstName);
  const n = rep.firstName;
  return (
    <>
      <SubpageHeader label={rep.pageName} cta={{ label: `Talk to ${n}`, onClick: goToForm }} />

      <main>
        <SplitPhotoHero
          badge={
            <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50/90 px-3.5 py-1.5 text-xs font-semibold text-navy-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
              Your 321 Swipe rep · {rep.territory}
            </span>
          }
          lines={rep.hero.lines}
          body={rep.hero.body}
          primary={{ label: `Send ${n} a statement`, onClick: goToForm }}
          secondary={{ label: "Ask a question", onClick: goToForm }}
          trustItems={[
            { strong: "Free", label: "statement review" },
            { strong: "Independent,", label: "not PE-owned" },
            { strong: "Month-to-month", label: "if you switch" },
          ]}
          photo={{ src: photos[rep.hero.photo], alt: rep.hero.alt, brief: rep.hero.brief, position: rep.hero.position ?? "50% 40%", tone: "warm" }}
          visual={<ReviewCard rep={rep} />}
        />

        {/* ── Who the rep works with ── */}
        <section id="who" className="py-24 lg:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 lg:gap-16 items-end mb-12">
              <div>
                <ScrollReveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                    Who {n} works with
                  </span>
                </ScrollReveal>
                <ScrollReveal delay={0.08}>
                  <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-[1.1] tracking-tight">
                    {rep.who.headline} <span className="text-accent-500">{rep.who.accent}</span>
                  </h2>
                </ScrollReveal>
              </div>
              <ScrollReveal delay={0.16}>
                <p className="text-base text-slate-500 leading-relaxed max-w-lg lg:pb-1">
                  {rep.who.body}
                </p>
              </ScrollReveal>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {industries.map((ind, i) => (
                <motion.article
                  key={ind.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: (i % 3) * 0.08, duration: 0.5, ease: EASE }}
                  className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 hover:border-slate-300 transition-all"
                >
                  <PhotoFrame
                    src={photos[ind.photo]}
                    alt={ind.alt}
                    brief={ind.brief}
                    tone={i % 2 ? "navy" : "light"}
                    motion="none"
                    position={ind.position}
                    className="h-[200px]"
                  />
                  <div className="p-5">
                    <h3 className="text-[15.5px] font-bold text-navy-900 leading-snug tracking-tight">{ind.title}</h3>
                    <p className="mt-1.5 text-[12px] text-slate-400 leading-snug">{ind.who}</p>
                    <p className="mt-3 text-[13.5px] text-slate-600 leading-relaxed">{ind.insight}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how" className="py-24 lg:py-28 bg-surface border-y border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
              <div>
                <ScrollReveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50 px-3.5 py-1.5 text-xs font-semibold text-navy-700 mb-6">
                    How it works
                  </span>
                </ScrollReveal>
                <ScrollReveal delay={0.08}>
                  <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-[1.1] tracking-tight">
                    One statement. One honest conversation.
                  </h2>
                </ScrollReveal>
                <ScrollReveal delay={0.16}>
                  <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-md">
                    No sales pitch on the first call. {n}&apos;s job is to make sure you understand what you&apos;re paying —
                    whether or not you ever process a card with 321 Swipe.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.28}>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      onClick={goToForm}
                      className="inline-flex items-center gap-2 rounded-lg bg-navy-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-navy-800 transition-colors"
                    >
                      Start with a statement
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70">
                        <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <a href="/statement-decoder" className="text-[13px] font-semibold text-accent-600 hover:text-accent-500">
                      Or see a statement decoded first →
                    </a>
                  </div>
                </ScrollReveal>
              </div>

              <div className="grid gap-4">
                {steps.map((s, i) => (
                  <motion.div
                    key={s.n}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                    className="flex gap-5 rounded-2xl bg-white border border-slate-200 p-5 sm:p-6"
                    style={{ boxShadow: "0 8px 30px rgba(12,21,36,0.05)" }}
                  >
                    <span className="text-[12px] font-mono font-semibold text-accent-500 pt-1">{s.n}</span>
                    <div>
                      <h3 className="text-[16px] font-bold text-navy-900 tracking-tight">{s.title}</h3>
                      <p className="mt-1.5 text-[14px] text-slate-500 leading-relaxed">{s.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Advisory (shared homepage section) ── */}
        <AdvisorySection photo={photos.analyst} />

        {/* ── Contact / statement form ── */}
        <section className="py-24 lg:py-28 bg-surface border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">
              <div className="lg:sticky lg:top-24">
                <ScrollReveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50 px-3.5 py-1.5 text-xs font-semibold text-navy-700 mb-6">
                    Reach {n}
                  </span>
                </ScrollReveal>
                <ScrollReveal delay={0.08}>
                  <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-[1.1] tracking-tight">
                    Send a statement, or just ask.
                  </h2>
                </ScrollReveal>
                <ScrollReveal delay={0.16}>
                  <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-md">
                    Everything on this form goes directly to {n}{" "}— not a queue, not a call center. You&apos;ll hear back within one
                    business day, usually sooner.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.24}>
                  <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 flex gap-4 items-start">
                    {rep.headshot && photos[rep.headshot] ? (
                      <img src={photos[rep.headshot]!} alt={rep.fullName} className="w-11 h-11 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-[15px] shrink-0">{rep.initials}</div>
                    )}
                    <div>
                      <p className="text-[15px] font-bold text-navy-900">{rep.fullName}</p>
                      <p className="text-[12.5px] text-slate-500">{rep.title} · {rep.territoryLong}</p>
                      <a href={`mailto:${rep.email}`} className="mt-2 inline-block text-[13px] font-semibold text-accent-600 hover:text-accent-500">
                        {rep.email}
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                  <p className="mt-5 text-[12px] text-slate-400 leading-relaxed max-w-md">
                    Prefer the secure portal? You can also{" "}
                    <a href={`https://upload.321swipe.com?rep=${rep.portalTag}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-navy-900">
                      upload a statement at upload.321swipe.com
                    </a>{" "}
                    and it will be routed to {n}.
                  </p>
                </ScrollReveal>
              </div>

              <ScrollReveal direction="right" className="min-w-0">
                <RepForm rep={rep} id="contact" />
              </ScrollReveal>
            </div>
          </div>
        </section>

        <ClosingCta
          photo={photos["van-dusk"]}
          badge={rep.pageName}
          title="Ready when you are."
          body={`One statement is all it takes to find out what you're really paying. Send it to ${n}, and it comes back marked up with a plain answer on what to do next.`}
          primary={{ label: `Send ${n} a statement`, onClick: goToForm }}
          trustPoints={["Free, no obligation", `Reviewed by ${n}, not a form`, "Independent, not PE-owned", "Month-to-month if you switch"]}
          id="cta"
        />
      </main>
    </>
  );
}
