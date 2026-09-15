"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { PhotoFrame } from "@/app/components/ui/PhotoFrame";
import { SubpageHeader } from "@/app/components/navigation/SubpageHeader";
import { ClosingCta } from "@/app/components/sections/ClosingCta";
import { EASE } from "@/app/lib/animations";
import type { PhotoMap } from "@/app/lib/photos";

// ── Helpers ───────────────────────────────────────────────────────────────────
// Same wiring as /certainpath: LeadModal and Tawk are mounted in the root layout.
const openModal = () => window.dispatchEvent(new Event("open-lead-modal"));

// ── Data ──────────────────────────────────────────────────────────────────────
const capabilities = [
  { kicker: "Underwriting", label: "File preparation & gap analysis" },
  { kicker: "Interchange", label: "Levels 1, 2 and 3 qualification" },
  { kicker: "Limits", label: "Caps, reserves and monitoring" },
  { kicker: "Model", label: "Retained, not project-by-project" },
];

const fitCards = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M12 3l7 4v5c0 4.4-3 8.3-7 9-4-.7-7-4.6-7-9V7l7-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Regulated and licensed products",
    body: "Pharmaceuticals, medical devices and other controlled categories, where acceptance depends on licensure and accreditation a processor has to verify before it will price the account at all.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <line x1="12" y1="2" x2="12" y2="22" />
        <path d="M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "High average ticket",
    body: "A $40,000 transaction is not a large version of a $400 one. It draws different scrutiny, different reserve terms and different fraud rules. The size of the ticket decides, not the size of the total.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M3 3v18h18" />
        <path d="M7 15l4-5 3 3 5-7" />
      </svg>
    ),
    title: "No processing history",
    body: "A new entity, a newly commercialised product, or a first move direct to market. There is no track record to underwrite against, so the file itself has to carry the argument.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <polyline points="3 17 8 11 12 14 17 7 21 10" />
        <line x1="3" y1="21" x2="21" y2="21" />
      </svg>
    ),
    title: "Volume that arrives in spikes",
    body: "Launches, seasonality, quarter-end concentration. A steady-state limit that looked generous in month one becomes the constraint in month four, usually without warning.",
  },
];

const workstreams = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    title: "Readiness and gap analysis",
    paras: [
      "Before anything reaches a processor, we establish what is missing: licences, certifications, audited financials, unit and location forecasts, ownership documentation. We tell you what will be asked for, and what a good answer looks like.",
      "A surprising share of declines are a documentation problem rather than a risk problem. The file was incomplete, so the model assumed the worst.",
    ],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    title: "Program design",
    paras: [
      "Which acceptance program, which pricing structure, and how to qualify transactions at the interchange level they actually belong in.",
      "For business-to-business acceptance, level 2 and level 3 data is where the real money sits — and it is routinely left on the table because nobody configured for it.",
    ],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M12 3v18" />
        <path d="M5 7h9a3 3 0 0 1 0 6H5" />
        <path d="M19 17H9" />
      </svg>
    ),
    title: "Benchmarking and negotiation",
    paras: [
      "What a business like yours should be paying, based on the terms we see across our book — expressed in basis points, not adjectives.",
      "We define the data fields and measures that track processor performance over time, so the next negotiation starts from evidence instead of starting over.",
    ],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15.5 14" />
      </svg>
    ),
    title: "Go-live and monitoring",
    paras: [
      "Credit limits, hard and soft caps, and the process for raising a limit before it binds rather than after it stops a sale. What the risk models watch, and why a limit moves.",
      "Then a weekly and monthly cadence, so a cap or a rate change is caught when it happens — not on a statement six weeks later.",
    ],
  },
];

const engagementCards = [
  {
    title: "On demand",
    body: "Requests come from your sponsor, with their own objectives. Turnaround is scoped when the request lands — not guessed at months in advance.",
  },
  {
    title: "Already briefed",
    body: "A retained advisor who knows your organisation, your volume and your constraints. Context does not get rebuilt from scratch every time you ask a question.",
  },
  {
    title: "Advisor network",
    body: "In-house expertise first, and where a question genuinely needs it, consultation with merchant processing industry advisors we already work with.",
  },
];

const callPrep = [
  "Your last three processor statements, if you are already accepting cards.",
  "Whatever underwriting has asked you for — and anything you have been declined for.",
  "Your licences and certifications, whether current or still in progress.",
  "A volume forecast: units, average ticket, and how it is distributed across the year.",
];

// ── Page ──────────────────────────────────────────────────────────────────────
export function AdvisoryPage({ photos }: { photos: PhotoMap }) {
  return (
    <>
      <SubpageHeader label="Merchant Advisory" cta={{ label: "Request a call", onClick: openModal }} />

      <main>
        {/* ── Hero: copy left, analyst photo right ── */}
        <section
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(130deg, #f9fbfe 0%, #f1f5f9 40%, #f9fbfe 100%)" }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, rgba(12,21,36,0.07) 1.2px, transparent 1.2px)", backgroundSize: "40px 40px", opacity: 0.22 }}
          />
          <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] min-h-[640px]">
            <div className="relative z-10 flex flex-col justify-center px-6 pt-28 pb-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-12 lg:pt-24">
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.05, ease: EASE }}>
                <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50/90 px-3.5 py-1.5 text-xs font-semibold text-navy-700 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                  Merchant advisory
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.15, ease: EASE }}
                className="mt-6 max-w-[24ch] font-bold tracking-[-0.038em] leading-[1.07] text-navy-900"
                style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
              >
                Some businesses don&apos;t have a rate problem.{" "}
                <span
                  style={{
                    background: "linear-gradient(125deg, #1a3ed4 0%, #2563eb 28%, #3b82f6 58%, #93c5fd 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}
                >
                  They have an approval problem.
                </span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.28, ease: EASE }} className="max-w-[56ch] mt-6 text-[16.5px] text-slate-600 leading-relaxed">
                High tickets. Regulated products. No processing history. Volume that arrives in spikes. When a
                business looks unusual to underwriting, the answer is often no — or a yes wrapped in caps and
                reserves that make it unusable.
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.34, ease: EASE }} className="max-w-[56ch] mt-4 text-[16.5px] text-slate-600 leading-relaxed">
                321 Swipe prepares the file, translates what processors are actually asking for, and stays on the
                account after go-live.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.43, ease: EASE }} className="mt-9 flex flex-wrap items-center gap-3">
                <motion.button
                  onClick={openModal}
                  whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center rounded-lg text-white text-sm font-semibold px-6 py-3 transition-colors"
                  style={{ background: "linear-gradient(135deg, #0c1524 0%, #132040 100%)", boxShadow: "0 1px 4px rgba(12,21,36,0.28), 0 6px 20px rgba(12,21,36,0.14)" }}
                >
                  Talk to an advisor
                </motion.button>
                <a
                  href="#work"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-navy-900 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  What the work involves
                </a>
              </motion.div>
            </div>

            <div className="relative min-h-[420px] lg:min-h-0">
              <PhotoFrame
                src={photos.analyst}
                alt="A 321 Swipe analyst preparing an underwriting file at a dual-monitor desk"
                brief="Over-the-shoulder: an analyst at a dual-monitor desk, statement on screen annotated in blue. Dark office, monitor glow."
                tone="navy"
                motion="kenburns"
                position="55% 40%"
                briefPosition="top-right"
                priority
                className="absolute inset-0 lg:[clip-path:polygon(9%_0,100%_0,100%_100%,0_100%)]"
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none hidden lg:block"
                style={{ background: "linear-gradient(90deg, #f3f6fa 0%, rgba(243,246,250,0.6) 8%, transparent 22%)" }}
              />
              {/* Capability strip overlapping the seam */}
              <motion.div
                initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.85, delay: 0.3, ease: EASE }}
                className="absolute left-1/2 -translate-x-1/2 bottom-8 w-[min(92%,360px)] lg:left-[-24px] lg:translate-x-0 lg:bottom-12 lg:w-[340px] bg-white rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 0 0 1px rgba(12,21,36,0.06), 0 16px 48px rgba(12,21,36,0.18), 0 40px 90px rgba(37,99,235,0.12)" }}
              >
                <div className="px-5 py-3.5 border-b border-slate-100">
                  <p className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-[0.08em]">What the engagement covers</p>
                </div>
                <div className="grid grid-cols-2 divide-x divide-y divide-slate-100">
                  {capabilities.map((c) => (
                    <div key={c.kicker} className="p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.11em] text-accent-500">{c.kicker}</div>
                      <div className="mt-1 text-[12.5px] font-semibold text-navy-900 leading-snug">{c.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Who this is for ── */}
        <section id="fit" className="py-24 lg:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                Who this is for
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-navy-900">
                The merchants processors find hard to read.
              </h2>
              <p className="max-w-[60ch] mt-4 text-base text-slate-500 leading-relaxed">
                None of this is exotic. It is ordinary business that happens to trip a standard underwriting
                model — and the model does not explain itself.
              </p>
            </ScrollReveal>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {fitCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
                  whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" as const } }}
                  className="group h-full rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 transition-shadow"
                >
                  <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-700 mb-3.5 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                    {card.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-navy-900 mb-1.5">{card.title}</h3>
                  <p className="text-[12.5px] text-slate-500 leading-relaxed">{card.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The work ── */}
        <section id="work" className="py-24 lg:py-28 bg-surface border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_1.55fr] gap-12 lg:gap-16 items-start">
              <div className="lg:sticky lg:top-28">
                <ScrollReveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                    The engagement
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1] text-navy-900">
                    What the work actually is.
                  </h2>
                  <p className="max-w-[46ch] mt-5 text-base text-slate-500 leading-relaxed">
                    Four workstreams. They tend to run in this order, but the order follows the business — not a
                    template.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <PhotoFrame
                    src={photos.statement}
                    alt="Hands marking line items on a printed processor statement with a highlighter"
                    brief="Tight crop: hands with a highlighter marking line items on a printed statement."
                    tone="warm"
                    motion="parallax"
                    className="mt-8 h-[220px] rounded-2xl"
                  />
                </ScrollReveal>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {workstreams.map((w, i) => (
                  <motion.div
                    key={w.title}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: i * 0.08, duration: 0.45, ease: EASE }}
                    className="h-full rounded-2xl border border-slate-200 bg-white p-6 hover:border-slate-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 shrink-0 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-accent-500">
                        {w.icon}
                      </div>
                      <h3 className="text-[15px] font-semibold text-navy-900">{w.title}</h3>
                    </div>
                    {w.paras.map((p, j) => (
                      <p key={j} className={`text-[13.5px] text-slate-600 leading-relaxed${j > 0 ? " mt-3" : ""}`}>
                        {p}
                      </p>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── How we engage ── */}
        <section id="engagement" className="py-24 lg:py-28 bg-white border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <PhotoFrame
                src={photos.advisor}
                alt="A 321 Swipe advisor on a call with a client, statement and notepad in front of her"
                brief="A 321 Swipe advisor on a headset call at a bright desk, mid-explanation and smiling."
                tone="navy"
                motion="parallax"
                position="46% 35%"
                className="h-[420px] lg:h-[520px] rounded-[20px]"
                style={{ boxShadow: "0 24px 60px rgba(12,21,36,0.14)" }}
              />
            </ScrollReveal>
            <div>
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                  How we engage
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1] text-navy-900">
                  Pre-positioned, not project&#8209;by&#8209;project.
                </h2>
                <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-lg">
                  The trouble with consulting is the lag. By the time a scope is written, approved and
                  countersigned, the question has moved on.
                </p>
                <p className="mt-4 text-base text-slate-500 leading-relaxed max-w-lg">
                  We work on a retainer that keeps us ready. You raise a request; we answer from what we already
                  know about your business. No new proposal, no restart, no re-explaining the account.
                </p>
              </ScrollReveal>
              <div className="mt-8 grid gap-3">
                {engagementCards.map((c, i) => (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: EASE }}
                    whileHover={{ x: 4, transition: { duration: 0.2, ease: "easeOut" as const } }}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 flex gap-5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100 transition-shadow"
                  >
                    <span className="shrink-0 text-2xl font-black text-navy-100 group-hover:text-accent-400 transition-colors select-none tabular-nums leading-none pt-0.5">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-navy-900 mb-1.5">{c.title}</h3>
                      <p className="text-[13px] text-slate-500 leading-relaxed">{c.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <ScrollReveal delay={0.4}>
                <p className="mt-6 text-[13.5px] text-slate-500">
                  Engagements are scoped individually and retainer terms are agreed up front —{" "}
                  <button
                    onClick={openModal}
                    className="text-accent-500 font-semibold hover:text-accent-600 underline underline-offset-2 decoration-accent-400/40 transition-colors"
                  >
                    ask on the call
                  </button>
                  .
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Start here ── */}
        <section id="start" className="py-24 lg:py-28 bg-surface border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                Start here
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1] text-navy-900">
                If underwriting is the bottleneck, start there.
              </h2>
              <p className="max-w-[60ch] mt-5 text-base text-slate-500 leading-relaxed">
                Send us what you have been asked for and what you have been told. We will tell you whether it is
                a documentation problem, a structure problem, or a genuine risk problem — and what it would take
                to move it.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={openModal}
                  className="inline-flex items-center justify-center rounded-lg text-white text-sm font-semibold px-6 py-3 transition-colors"
                  style={{ background: "linear-gradient(135deg, #0c1524 0%, #132040 100%)" }}
                >
                  Talk to an advisor
                </button>
                <a
                  href="https://upload.321swipe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-navy-900 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Send a statement
                </a>
              </div>
              <p className="mt-5 text-[12.5px] text-slate-400">
                Everything shared is treated as confidential. We will sign your NDA before you send anything.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
                <div className="text-[11px] font-semibold uppercase tracking-[0.11em] text-slate-400">
                  Useful to have on the call
                </div>
                <ul className="mt-4 grid gap-3.5">
                  {callPrep.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                      <span className="text-[13.5px] text-slate-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[12.5px] text-slate-500 leading-relaxed">
                  If you have none of it yet, that is a normal place to start. Assembling it is the first
                  workstream.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <ClosingCta
          photo={photos["van-dusk"]}
          badge="Merchant advisory"
          title="Hard to board? Start with the file, not the rate."
          body="Send us what underwriting has asked for and what you have been told so far. We will tell you what is missing, what it would take to move, and what a business like yours should be paying."
          primary={{ label: "Talk to an advisor", onClick: openModal }}
          trustPoints={["NDA before anything is shared", "Retained, not project-by-project", "Benchmarked in basis points", "Stays on the account after go-live"]}
        />
      </main>
    </>
  );
}
