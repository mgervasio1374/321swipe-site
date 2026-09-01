"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";

// ── Helpers ───────────────────────────────────────────────────────────────────
// Same wiring as /certainpath: LeadModal and Tawk are mounted in the root layout.
const openModal = () => window.dispatchEvent(new Event("open-lead-modal"));
const openChat = () => (window as unknown as { Tawk_API?: { maximize?: () => void } }).Tawk_API?.maximize?.();

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
export default function AdvisoryPage() {
  return (
    <>
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100/80"
        style={{ boxShadow: "0 1px 20px rgba(12,21,36,0.05)" }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-[60px] items-center justify-between gap-6">
            <Link href="/" className="shrink-0">
              <Image
                src="/logo-dark.svg"
                alt="321 Swipe"
                width={128}
                height={51}
                style={{ height: "auto", maxHeight: "34px", width: "auto" }}
                priority
              />
            </Link>
            <div className="hidden sm:flex items-center gap-2.5 flex-1">
              <span className="w-px h-4 bg-slate-200" />
              <span className="text-[12px] font-medium text-slate-400">Merchant Advisory</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={openChat}
                className="hidden md:block text-[13px] font-medium text-slate-500 hover:text-navy-900 px-3 py-2 transition-colors"
              >
                Talk to 321 Swipe
              </button>
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg text-white text-[13px] font-semibold px-4 py-2 transition-colors"
                style={{ background: "linear-gradient(135deg, #0c1524 0%, #132040 100%)" }}
              >
                Request a call
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-white py-16 sm:py-24">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 6%, rgba(37,99,235,0.10), transparent 34%), radial-gradient(circle at 86% 0%, rgba(59,130,246,0.07), transparent 38%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                Merchant advisory
              </span>
              <h1 className="max-w-[26ch] text-[2rem] sm:text-[2.5rem] lg:text-[2.9rem] font-bold tracking-[-0.038em] leading-[1.07] text-navy-900">
                Some businesses don&apos;t have a rate problem. They have an approval problem.
              </h1>
              <p className="max-w-[56ch] mt-6 text-[16.5px] text-slate-600 leading-relaxed">
                High tickets. Regulated products. No processing history. Volume that arrives in spikes. When a
                business looks unusual to underwriting, the answer is often no — or a yes wrapped in caps and
                reserves that make it unusable.
              </p>
              <p className="max-w-[56ch] mt-4 text-[16.5px] text-slate-600 leading-relaxed">
                321 Swipe prepares the file, translates what processors are actually asking for, and stays on the
                account after go-live.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button
                  onClick={openModal}
                  className="inline-flex items-center justify-center rounded-xl text-white text-sm font-semibold px-5 py-3 transition-colors"
                  style={{ background: "linear-gradient(135deg, #0c1524 0%, #132040 100%)" }}
                >
                  Talk to an advisor
                </button>
                <a
                  href="#work"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-navy-900 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  What the work involves
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl border border-slate-200 bg-slate-200 overflow-hidden">
                {capabilities.map((c) => (
                  <div key={c.kicker} className="bg-white p-5">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.11em] text-slate-400">
                      {c.kicker}
                    </div>
                    <div className="mt-1.5 text-sm font-semibold text-navy-900">{c.label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Who this is for ── */}
        <section id="fit" className="py-20 lg:py-24 bg-surface border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                Who this is for
              </span>
              <h2 className="text-[1.5rem] lg:text-[1.95rem] font-bold tracking-[-0.025em] leading-tight text-navy-900">
                The merchants processors find hard to read.
              </h2>
              <p className="max-w-[60ch] mt-4 text-[15.5px] text-slate-600 leading-relaxed">
                None of this is exotic. It is ordinary business that happens to trip a standard underwriting
                model — and the model does not explain itself.
              </p>
            </ScrollReveal>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {fitCards.map((card, i) => (
                <ScrollReveal key={card.title} delay={i * 0.08}>
                  <div className="group h-full rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition-all">
                    <div className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-accent-500 mb-3.5 group-hover:border-accent-200 group-hover:bg-accent-50 transition-colors">
                      {card.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-navy-900 mb-1.5">{card.title}</h3>
                    <p className="text-[12.5px] text-slate-500 leading-relaxed">{card.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── The work ── */}
        <section id="work" className="py-20 lg:py-24 bg-white border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                The engagement
              </span>
              <h2 className="text-[1.5rem] lg:text-[1.95rem] font-bold tracking-[-0.025em] leading-tight text-navy-900">
                What the work actually is.
              </h2>
              <p className="max-w-[60ch] mt-4 text-[15.5px] text-slate-600 leading-relaxed">
                Four workstreams. They tend to run in this order, but the order follows the business — not a
                template.
              </p>
            </ScrollReveal>

            <div className="mt-10 grid md:grid-cols-2 gap-4">
              {workstreams.map((w, i) => (
                <ScrollReveal key={w.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-slate-200 bg-slate-50/60 p-6 hover:border-slate-300 hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 shrink-0 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-accent-500">
                        {w.icon}
                      </div>
                      <h3 className="text-[15px] font-semibold text-navy-900">{w.title}</h3>
                    </div>
                    {w.paras.map((p, j) => (
                      <p key={j} className={`text-[13.5px] text-slate-600 leading-relaxed${j > 0 ? " mt-3" : ""}`}>
                        {p}
                      </p>
                    ))}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── How we engage ── */}
        <section id="engagement" className="py-20 lg:py-24 bg-navy-50 border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 lg:gap-16 items-start">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                How we engage
              </span>
              <h2 className="text-[1.5rem] lg:text-[1.95rem] font-bold tracking-[-0.025em] leading-tight text-navy-900">
                Pre-positioned, not project&#8209;by&#8209;project.
              </h2>
              <p className="mt-4 text-[15.5px] text-slate-600 leading-relaxed">
                The trouble with consulting is the lag. By the time a scope is written, approved and
                countersigned, the question has moved on.
              </p>
              <p className="mt-4 text-[15.5px] text-slate-600 leading-relaxed">
                We work on a retainer that keeps us ready. You raise a request; we answer from what we already
                know about your business. No new proposal, no restart, no re-explaining the account.
              </p>
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

            <div className="grid gap-4">
              {engagementCards.map((c, i) => (
                <ScrollReveal key={c.title} delay={i * 0.08}>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-sm font-semibold text-navy-900 mb-1.5">{c.title}</h3>
                    <p className="text-[12.5px] text-slate-500 leading-relaxed">{c.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Start here ── */}
        <section id="start" className="py-20 lg:py-24 bg-white border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                Start here
              </span>
              <h2 className="text-[1.5rem] lg:text-[1.95rem] font-bold tracking-[-0.025em] leading-tight text-navy-900">
                If underwriting is the bottleneck, start there.
              </h2>
              <p className="max-w-[60ch] mt-4 text-[15.5px] text-slate-600 leading-relaxed">
                Send us what you have been asked for and what you have been told. We will tell you whether it is
                a documentation problem, a structure problem, or a genuine risk problem — and what it would take
                to move it.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={openModal}
                  className="inline-flex items-center justify-center rounded-xl text-white text-sm font-semibold px-5 py-3 transition-colors"
                  style={{ background: "linear-gradient(135deg, #0c1524 0%, #132040 100%)" }}
                >
                  Talk to an advisor
                </button>
                <a
                  href="https://upload.321swipe.com"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-navy-900 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  Send a statement
                </a>
              </div>
              <p className="mt-5 text-[12.5px] text-slate-400">
                Everything shared is treated as confidential. We will sign your NDA before you send anything.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-7">
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
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <Image
              src="/logo-dark.svg"
              alt="321 Swipe"
              width={110}
              height={44}
              className="opacity-60"
              style={{ height: "auto", maxHeight: "28px", width: "auto" }}
            />
            <p className="text-[11px] text-slate-400">
              Independent, contractor-first payment intelligence.
            </p>
          </div>
          <p className="text-[11px] text-slate-400">© {new Date().getFullYear()} 321 Swipe.</p>
          <nav className="flex gap-5">
            <Link href="/" className="text-[12.5px] text-slate-500 hover:text-navy-900 transition-colors">Home</Link>
            <a href="#" className="text-[12.5px] text-slate-500 hover:text-navy-900 transition-colors">Privacy</a>
            <a href="#" className="text-[12.5px] text-slate-500 hover:text-navy-900 transition-colors">Terms</a>
            <button onClick={openChat} className="text-[12.5px] text-slate-500 hover:text-navy-900 transition-colors">Contact</button>
          </nav>
        </div>
      </footer>
    </>
  );
}
