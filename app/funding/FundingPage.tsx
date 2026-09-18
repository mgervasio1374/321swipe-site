"use client";

import { motion } from "framer-motion";
import { SubpageHeader } from "@/app/components/navigation/SubpageHeader";
import { ClosingCta } from "@/app/components/sections/ClosingCta";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";
import { track } from "@/app/lib/analytics";
import type { PhotoMap } from "@/app/lib/photos";

const openModal = () => window.dispatchEvent(new Event("open-lead-modal"));

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
});

const PORTAL = "https://www.mypaymentsinsider.com";
const AVVANCE = "https://avvance.usbank.com/";

// ── Content ──────────────────────────────────────────────────────────────────

const STATS = [
  { value: "Minutes", label: "From batch to bank", detail: "Any day, including weekends and holidays." },
  { value: "$50,000", label: "Per day", detail: "Unlimited transfers, up to the daily cap." },
  { value: "1.5%", label: "Flat fee", detail: "Not a loan. No interest, no monthly fee." },
];

const STEPS = [
  {
    n: "01",
    title: "Run your day as usual",
    body: "Take cards the way you already do. Everything you've charged sits in an open batch until it settles.",
  },
  {
    n: "02",
    title: "Tap “On Demand Funding”",
    body: "In your Payments Insider dashboard, choose the batch and the bank account or debit card you linked when you enrolled.",
  },
  {
    n: "03",
    title: "Money lands in minutes",
    body: "The batch settles and funds go straight to your account. If it isn’t there in 30 minutes, call your bank first, then us.",
  },
];

const REGISTER_NEEDS = [
  "Your name and the email address on file with your merchant account",
  "Your Merchant ID (on your statement or welcome letter)",
  "The last four digits of your business checking account",
];

const FINE_PRINT = [
  "The fee is 1.5% of the gross batch total for each batch you settle through On Demand Funding, on top of your normal processing costs. Batches you leave to settle overnight are not charged.",
  "Transfers are capped at $50,000 per day. Your debit card issuer may set a lower limit; a bank account linked for real-time payments usually does not.",
  "One debit card can be on file at a time, and changing the card number starts a five-day waiting period before the new card can be used.",
  "Availability is decided by the processor based on your account’s risk and batch profile. If you don’t see the button after registering, tell us and we’ll find out why.",
  "Not available for lodging, cash advance, AmEx Direct, Discover Direct, fuel/fleet, or accounts running surcharge or convenience-fee programs. Each location enrolls separately.",
  "Only the account owner or an authorized signer can enroll.",
];

const AVVANCE_POINTS = [
  { label: "Loan size", value: "$300 – $25,000" },
  { label: "Terms", value: "3 – 60 months" },
  { label: "APR", value: "0% – 24.99%" },
  { label: "You’re paid", value: "In full, within 48 hours" },
];

// ── Hero visual: a batch card ────────────────────────────────────────────────

function BatchCard() {
  const batch = 4860.0;
  const fee = Math.round(batch * 0.015 * 100) / 100;
  const net = batch - fee;
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
      className="relative mx-auto w-full max-w-[400px] rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-navy-900/10 overflow-hidden"
      aria-hidden
    >
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">Open batch</span>
        <span className="text-[11px] text-slate-400 tabular-nums">Sat 4:52 PM</span>
      </div>
      <div className="px-5 pt-5 pb-4">
        <p className="text-[12px] text-slate-500">Today’s card sales</p>
        <p className="mt-1 text-[34px] font-bold tracking-tight text-navy-900 tabular-nums leading-none">{fmt(batch)}</p>
        <dl className="mt-5 grid grid-cols-[1fr_auto] gap-y-1.5 text-[13px]">
          <dt className="text-slate-500">On Demand Funding fee (1.5%)</dt>
          <dd className="text-slate-500 tabular-nums text-right">−{fmt(fee)}</dd>
          <dt className="font-semibold text-navy-900 pt-1.5 border-t border-slate-100">To your bank</dt>
          <dd className="font-semibold text-navy-900 tabular-nums text-right pt-1.5 border-t border-slate-100">{fmt(net)}</dd>
        </dl>
      </div>
      <div className="px-5 pb-5">
        <div className="relative rounded-lg bg-navy-900 text-white text-sm font-semibold px-4 py-3 flex items-center justify-between overflow-hidden">
          <span>Transfer now</span>
          <motion.span
            initial={{ x: -6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Arrives in minutes
          </motion.span>
          <motion.span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1/3 bg-white/10"
            initial={{ x: "-120%" }}
            animate={{ x: "400%" }}
            transition={{ delay: 1.4, duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
          />
        </div>
        <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">
          Or leave it alone and it settles next business day at no extra cost.
        </p>
      </div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function FundingPage({ photos }: { photos: PhotoMap }) {
  return (
    <>
      <SubpageHeader label="Funding" cta={{ label: "Ask about funding", onClick: () => { track({ name: "funding_cta", placement: "header" }); openModal(); } }} />

      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(130deg, #f9fbfe 0%, #f1f5f9 40%, #f9fbfe 100%)" }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, rgba(12,21,36,0.07) 1.2px, transparent 1.2px)", backgroundSize: "40px 40px", opacity: 0.22 }}
          />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-16 lg:pt-32 lg:pb-24">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
              <div>
                <motion.div {...fade(0.05)}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50/90 px-3.5 py-1.5 text-xs font-semibold text-navy-700 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                    On Demand Funding
                  </span>
                </motion.div>
                <motion.h1
                  {...fade(0.15)}
                  className="mt-6 max-w-[16ch] font-bold tracking-[-0.038em] leading-[1.05] text-navy-900"
                  style={{ fontSize: "clamp(2.3rem, 4.4vw, 3.6rem)" }}
                >
                  Your batch, in your account, in minutes.
                </motion.h1>
                <motion.p {...fade(0.25)} className="mt-6 max-w-[500px] text-[1.05rem] text-slate-500 leading-[1.72]">
                  Something breaks on a Saturday. A supplier wants paying before Monday. Payroll is a day early.
                  On Demand Funding moves the cards you&apos;ve already run into your bank account whenever you say
                  so, for a flat 1.5% &mdash; no loan, no interest, no monthly fee.
                </motion.p>
                <motion.div {...fade(0.35)} className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href="#enroll"
                    onClick={() => track({ name: "funding_cta", placement: "hero_enroll" })}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-900 text-white text-sm font-semibold px-6 py-3.5 hover:bg-navy-800 transition-colors"
                  >
                    I&apos;m a 321 Swipe customer &mdash; enroll me
                  </a>
                  <button
                    type="button"
                    onClick={() => { track({ name: "funding_cta", placement: "hero_ask" }); openModal(); }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 text-navy-900 text-sm font-semibold px-6 py-3.5 hover:border-navy-900 transition-colors"
                  >
                    Not a customer yet? Talk to us
                  </button>
                </motion.div>
              </div>
              <div className="lg:justify-self-end w-full">
                <BatchCard />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-y border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-[minmax(0,1fr)] sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {STATS.map((s, i) => (
              <ScrollReveal key={s.label} delay={0.06 * i} className="py-8 sm:px-8 first:sm:pl-0 last:sm:pr-0">
                <p className="text-[30px] font-bold tracking-tight text-navy-900 leading-none tabular-nums">{s.value}</p>
                <p className="mt-2 text-[13px] font-semibold text-navy-900">{s.label}</p>
                <p className="mt-1 text-[13px] text-slate-500">{s.detail}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
            <div>
              <ScrollReveal>
                <h2 className="text-[26px] sm:text-[30px] font-bold text-navy-900 tracking-tight leading-tight">How it works</h2>
                <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-sm">
                  Normally a batch settles overnight and hits your bank the next business day. On Demand Funding
                  lets you pull it forward on the days you need to &mdash; and leave it alone on the days you don&apos;t.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200/80 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Our honest take</p>
                  <p className="mt-2 text-[14px] text-navy-900 leading-relaxed">
                    On a $5,000 batch the fee is $75. That&apos;s a good trade on the day a compressor fails
                    and a bad habit if you do it every day. Use it like a tool, not a default &mdash; and if you find
                    yourself needing it constantly, call us; that&apos;s usually a pricing or cash-flow conversation, not a funding one.
                  </p>
                </div>
              </ScrollReveal>
            </div>
            <ol className="grid grid-cols-[minmax(0,1fr)] gap-4">
              {STEPS.map((s, i) => (
                <ScrollReveal key={s.n} delay={0.08 * i}>
                  <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 rounded-2xl border border-slate-200 p-6 bg-white">
                    <span className="text-[12px] font-mono font-semibold text-accent-600 pt-1">{s.n}</span>
                    <div>
                      <h3 className="text-[17px] font-semibold text-navy-900 tracking-tight">{s.title}</h3>
                      <p className="mt-1.5 text-[14.5px] text-slate-500 leading-relaxed">{s.body}</p>
                    </div>
                  </li>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Enroll */}
        <section id="enroll" className="py-20 lg:py-24 bg-navy-900 text-white scroll-mt-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-blue-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                For current 321 Swipe customers
              </span>
              <h2 className="mt-5 max-w-[22ch] text-[26px] sm:text-[32px] font-bold tracking-tight leading-tight">
                Turn it on yourself in about ten minutes.
              </h2>
              <p className="mt-3 max-w-[560px] text-[15px] text-blue-100/75 leading-relaxed">
                On Demand Funding lives inside Payments Insider, the online dashboard for your merchant account.
                Two parts: get into the dashboard, then link where you want the money to go.
              </p>
            </ScrollReveal>

            <div className="mt-12 grid lg:grid-cols-2 gap-6">
              <ScrollReveal>
                <div className="h-full rounded-2xl bg-white/[0.04] border border-white/10 p-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-blue-300">Part 1</p>
                  <h3 className="mt-2 text-[19px] font-semibold tracking-tight">Register for Payments Insider</h3>
                  <p className="mt-1.5 text-[13.5px] text-blue-100/65">Skip this if you already log in there to see statements.</p>
                  <ol className="mt-5 flex flex-col gap-3 text-[14.5px] leading-relaxed">
                    <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                      <span className="font-mono text-[12px] text-blue-300 pt-1">1</span>
                      <span>Go to <a href={PORTAL} target="_blank" rel="noopener noreferrer" className="underline decoration-blue-300/50 underline-offset-4 hover:decoration-white">mypaymentsinsider.com</a> and choose <b>Register</b>.</span>
                    </li>
                    <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                      <span className="font-mono text-[12px] text-blue-300 pt-1">2</span>
                      <span>
                        Have these ready:
                        <ul className="mt-2 flex flex-col gap-1.5 text-[13.5px] text-blue-100/80">
                          {REGISTER_NEEDS.map((r) => (
                            <li key={r} className="grid grid-cols-[auto_minmax(0,1fr)] gap-2">
                              <span className="mt-[9px] h-1 w-1 rounded-full bg-blue-300" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </span>
                    </li>
                    <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                      <span className="font-mono text-[12px] text-blue-300 pt-1">3</span>
                      <span>Confirm the email it sends you, set a password and your security questions. You&apos;re in.</span>
                    </li>
                  </ol>
                  <p className="mt-5 text-[12.5px] text-blue-100/55 leading-relaxed">
                    Registration is limited to the account owner or an authorized signer, using the email you gave when the
                    account was opened. New accounts can register 48 hours after the Merchant ID is issued.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="h-full rounded-2xl bg-white text-navy-900 p-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-accent-600">Part 2</p>
                  <h3 className="mt-2 text-[19px] font-semibold tracking-tight">Enroll in On Demand Funding</h3>
                  <p className="mt-1.5 text-[13.5px] text-slate-500">Inside the dashboard, once you&apos;re logged in.</p>
                  <ol className="mt-5 flex flex-col gap-3 text-[14.5px] leading-relaxed text-navy-900">
                    <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                      <span className="font-mono text-[12px] text-accent-600 pt-1">1</span>
                      <span>Click the <b>On Demand Funding</b> button on your dashboard.</span>
                    </li>
                    <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                      <span className="font-mono text-[12px] text-accent-600 pt-1">2</span>
                      <span>
                        Securely link where the money should go: your business bank account, or a Visa or Mastercard
                        business debit card. A bank account is the better choice &mdash; no card limits, and nothing to
                        re-link when a card is replaced.
                      </span>
                    </li>
                    <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                      <span className="font-mono text-[12px] text-accent-600 pt-1">3</span>
                      <span>Next time you need it, open the batch, choose <b>Transfer</b>, and the money is on its way.</span>
                    </li>
                  </ol>
                  <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200/80 p-4 text-[13px] text-slate-600 leading-relaxed">
                    <b className="text-navy-900">Don&apos;t see the button?</b> The processor decides eligibility from your
                    account&apos;s risk and batch profile. Email{" "}
                    <a href="mailto:sales@321swipe.com" className="text-accent-600 font-semibold">sales@321swipe.com</a>{" "}
                    with your business name and we&apos;ll chase it.
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Fine print */}
        <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-16">
            <ScrollReveal>
              <h2 className="text-[22px] font-bold text-navy-900 tracking-tight">The fine print, in plain English</h2>
              <p className="mt-2 text-[14px] text-slate-500 leading-relaxed max-w-sm">
                We&apos;d rather you read it here than find it later. On Demand Funding is provided by our processing
                partner, Elavon, through the Payments Insider and Converge platforms.
              </p>
            </ScrollReveal>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-3">
              {FINE_PRINT.map((f, i) => (
                <ScrollReveal key={i} delay={0.04 * i}>
                  <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 text-[14px] text-slate-600 leading-relaxed">
                    <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-navy-900/60" />
                    <span>{f}</span>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Customer financing */}
        <section id="financing" className="py-20 lg:py-24 bg-white scroll-mt-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-start">
              <div>
                <ScrollReveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500">
                    Customer financing
                  </span>
                  <h2 className="mt-5 max-w-[20ch] text-[26px] sm:text-[32px] font-bold text-navy-900 tracking-tight leading-tight">
                    Let the homeowner pay over time. You get paid in full.
                  </h2>
                  <p className="mt-4 max-w-[540px] text-[15.5px] text-slate-500 leading-[1.72]">
                    A $9,000 system replacement is an easier yes as a monthly payment than as one check. We offer point-of-sale
                    financing through <b className="text-navy-900">Avvance from U.S. Bank</b>: you send the customer
                    an invoice with an application link, they apply from their phone in a minute or two and get a real-time
                    decision, and U.S. Bank pays you the full amount within 48 hours. They collect the monthly payments &mdash;
                    you never carry the paper.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.1}>
                  <div className="mt-7 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => { track({ name: "funding_cta", placement: "financing" }); openModal(); }}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-900 text-white text-sm font-semibold px-6 py-3.5 hover:bg-navy-800 transition-colors"
                    >
                      Add financing to my account
                    </button>
                    <a
                      href={AVVANCE}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 text-navy-900 text-sm font-semibold px-6 py-3.5 hover:border-navy-900 transition-colors"
                    >
                      About Avvance
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-60"><path d="M6 3h7v7h-1.5V5.56L5.03 12.03 3.97 10.97 10.44 4.5H6V3z" /></svg>
                    </a>
                  </div>
                  <p className="mt-4 text-[12.5px] text-slate-400 leading-relaxed max-w-[540px]">
                    Subject to credit approval. Loan amounts, terms and rates are set by U.S. Bank for each customer.
                    Enrollment is free; you pay a per-transaction fee on financed sales, with no monthly or subscription charge.
                  </p>
                </ScrollReveal>
              </div>
              <ScrollReveal delay={0.12}>
                <dl className="grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 gap-4">
                  {AVVANCE_POINTS.map((p) => (
                    <div key={p.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">{p.label}</dt>
                      <dd className="mt-2 text-[20px] font-bold text-navy-900 tracking-tight leading-tight tabular-nums">{p.value}</dd>
                    </div>
                  ))}
                </dl>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <ClosingCta
          photo={photos["van-dusk"]}
          badge="Funding & financing"
          title={<>Want either of these turned on?</>}
          body="Tell us which one and the name on your merchant account. Existing customers usually have On Demand Funding running the same week; financing takes a short enrollment with U.S. Bank."
          primary={{ label: "Ask about funding", onClick: () => { track({ name: "funding_cta", placement: "closing" }); openModal(); } }}
          trustPoints={["No monthly fees for either", "Nothing to sign for On Demand Funding", "We'll tell you if it doesn't fit"]}
        />
      </main>
    </>
  );
}
