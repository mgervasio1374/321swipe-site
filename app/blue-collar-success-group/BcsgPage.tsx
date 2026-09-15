"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { SubpageHeader } from "@/app/components/navigation/SubpageHeader";
import { SplitPhotoHero } from "@/app/components/hero/SplitPhotoHero";
import { ReviewFindingsSection } from "@/app/components/sections/ReviewFindingsSection";
import { VerianSection } from "@/app/components/sections/VerianSection";
import { AdvisorSection } from "@/app/components/sections/AdvisorSection";
import { ServicesGrid } from "@/app/components/sections/ServicesGrid";
import { ClosingCta } from "@/app/components/sections/ClosingCta";
import { SavingsCalculator } from "./SavingsCalculator";
import { EASE } from "@/app/lib/animations";
import type { PhotoMap } from "@/app/lib/photos";

// ── Helpers ───────────────────────────────────────────────────────────────────
const openModal = () => window.dispatchEvent(new Event("open-lead-modal"));
const openChat  = () => window.Tawk_API?.maximize?.();

const icon = (d: React.ReactNode, size = "w-5 h-5") => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={size}>{d}</svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const partnerCards = [
  { icon: icon(<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />),
    title: "Know what you're really paying",
    body: "We translate confusing processor statements into plain-English insights so you can see exactly what every fee means." },
  { icon: icon(<><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>),
    title: "Find hidden fees and pricing issues",
    body: "We look for markups, interchange downgrades, monthly access fees, and avoidable costs hiding in your statement." },
  { icon: icon(<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />),
    title: "Improve payment visibility",
    body: "We help contractors understand deposits, funding timing, and payment activity — so cash flow is never a guessing game." },
];

const diagnostics = [
  { icon: icon(<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>, "w-4 h-4"), title: "Markup creep", body: "Processor markups that quietly increase after the original agreement — often without notice." },
  { icon: icon(<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>, "w-4 h-4"), title: "Hidden monthly fees", body: "PCI fees, batch fees, statement fees, access fees, and other line items that compound quietly." },
  { icon: icon(<><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>, "w-4 h-4"), title: "Interchange downgrades", body: "Transactions routing at higher-cost categories due to setup, card type, or missing data." },
  { icon: icon(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, "w-4 h-4"), title: "Funding delays", body: "Deposits arriving slower than standard — creating cash-flow drag on completed jobs." },
  { icon: icon(<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>, "w-4 h-4"), title: "Payment workflow gaps", body: "Manual collection steps, missed invoice payments, or disconnected job and payment data." },
  { icon: icon(<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>, "w-4 h-4"), title: "Contract traps", body: "Long-term terms, liquidated damages, auto-renewals, and cancellation penalties in the fine print." },
];

const verianBullets = ["Monthly statement review", "Hidden fee detection", "Rate optimization guidance", "Funding and deposit visibility", "Human-reviewed findings"];

const pillars = [
  { number: "01", title: "A named advisor. Not a call center.", body: "Every client gets a dedicated account manager who knows your business. When you have a question, you call them directly — not a 1-800 number." },
  { number: "02", title: "Monthly statement reviews. Without being asked.", body: "We review your processor statement every month and bring findings to you — new fees, rate changes, unusual activity — before you have to ask." },
  { number: "03", title: "Setup done right. Fast.", body: "We handle equipment, integrations, and testing. Most clients are live in under a week with zero downtime." },
  { number: "04", title: "Ongoing strategy. Not a one-time sale.", body: "As your business grows, your payment setup should evolve. We check in regularly and adjust so you're never paying more than you should." },
];

const supportingServices = [
  { title: "Mobile payments", body: "Tap-to-pay, digital invoices, and field receipts — built for crews on-site, not just the office.", icon: icon(<><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>) },
  { title: "Recurring billing", body: "Support for maintenance agreements, memberships, and recurring service plans. Set up once, collect reliably.", icon: icon(<path d="M21 12a9 9 0 11-3-6.7M21 3v6h-6" />) },
  { title: "Funding visibility", body: "Clearer understanding of deposits, batches, funding timing, and daily payment activity.", icon: icon(<><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></>) },
  { title: "Surcharging", body: "Compliance-aware surcharge guidance that offsets processing costs while protecting the customer experience.", icon: icon(<path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />) },
];

// ── Hero visual: statement review card ────────────────────────────────────────
const findings = [
  { label: "Markup above agreement", amount: "$340", color: "#ef4444" },
  { label: "PCI & access fees",      amount: "$128", color: "#f97316" },
  { label: "Interchange downgrades", amount: "$214", color: "#eab308" },
];

function StatementReviewCard() {
  return (
    <div className="relative select-none">
      <motion.div animate={{ y: [0, -9, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}>
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 0 0 1px rgba(12,21,36,0.06), 0 16px 48px rgba(12,21,36,0.18), 0 40px 90px rgba(37,99,235,0.12)" }}
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <div>
              <p className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-[0.08em]">Statement review</p>
              <p className="text-[13px] font-bold text-navy-900 mt-0.5">Apex Roofing LLC · last month</p>
            </div>
            <span className="relative flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <span className="relative flex w-2 h-2">
                <span className="live-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              Complete
            </span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3.5 bg-slate-50 border border-slate-200">
                <p className="text-[8.5px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Current effective rate</p>
                <p className="text-[22px] font-bold tabular-nums leading-none text-slate-700">3.22%</p>
                <p className="text-[8.5px] text-slate-400 mt-0.5">What you paid</p>
              </div>
              <div className="rounded-xl p-3.5" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.18)" }}>
                <p className="text-[8.5px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Optimized rate</p>
                <p className="text-[22px] font-bold tabular-nums leading-none text-accent-600">2.41%</p>
                <p className="text-[8.5px] text-slate-400 mt-0.5">After review</p>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Findings</p>
              <div className="space-y-1.5">
                {findings.map((f) => (
                  <div key={f.label} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: f.color }} />
                      <span className="text-[11px] text-slate-500">{f.label}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 tabular-nums">{f.amount}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="rounded-xl p-4 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0.04) 100%)", border: "1px solid rgba(37,99,235,0.14)" }}
            >
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-accent-500 mb-1">Est. monthly savings</p>
                <p className="text-[22px] font-bold text-navy-900 tabular-nums leading-none">$560<span className="text-sm font-normal text-slate-400">/mo</span></p>
                <p className="text-[9px] text-slate-400 mt-1">3 issues identified · 0.81% rate improvement</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent-50 border border-accent-100 flex items-center justify-center text-accent-500 shrink-0">
                {icon(<path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />, "w-4.5 h-4.5")}
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3, ease: EASE }}
          className="absolute -top-4 -right-3 lg:right-auto lg:-left-3 bg-white rounded-xl px-3.5 py-2.5 flex items-center gap-2.5"
          style={{ boxShadow: "0 6px 24px rgba(12,21,36,0.14), 0 0 0 1px rgba(12,21,36,0.06)" }}
        >
          <div className="w-7 h-7 rounded-full bg-accent-50 flex items-center justify-center text-accent-500 shrink-0">
            {icon(<path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />, "w-3.5 h-3.5")}
          </div>
          <div>
            <p className="text-[10.5px] font-bold text-navy-900 leading-none">Insight from 321 Swipe</p>
            <p className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">3 hidden fees found · $560/mo est.</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function BcsgPage({ photos }: { photos: PhotoMap }) {
  return (
    <>
      <SubpageHeader label="For Blue Collar Success Group Members" cta={{ label: "Request a Review", onClick: openModal }} />

      <main>
        <SplitPhotoHero
          badge={
            <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50/90 px-3.5 py-1.5 text-xs font-semibold text-navy-700 shadow-sm">
              <span className="relative flex w-1.5 h-1.5">
                <span className="live-ring absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-60" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-accent-500" />
              </span>
              For Blue Collar Success Group Members
            </span>
          }
          lines={["Payment intelligence", "for Blue Collar", "Success Group members."]}
          body="321 Swipe helps home service contractors review their merchant statements, uncover hidden fees, improve payment visibility, and make smarter decisions about processing costs — with real people reviewing real numbers."
          primary={{ label: "Request a Free Statement Review", onClick: openModal }}
          secondary={{ label: "Talk to 321 Swipe", onClick: openChat }}
          trustItems={[
            { strong: "Independent,", label: "not PE-owned" },
            { strong: "Real reviews", label: "by real advisors" },
            { strong: "Month-to-month", label: "relationships" },
          ]}
          photo={{
            src: photos["roofing-crew"],
            alt: "A roofing crew at work at golden hour while the foreman checks his phone",
            brief: "Roofing crew at golden hour, foreman on the ground checking a phone, ladders and a plain truck.",
            position: "30% 40%",
            tone: "warm",
          }}
          visual={<StatementReviewCard />}
        />

        {/* ── Built for contractors ── */}
        <section className="py-24 lg:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-5">Built for contractors</span>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-tight tracking-tight">
                  Built for the same contractors Blue Collar Success Group helps grow.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.16}>
                <p className="mt-4 text-base text-slate-500 leading-relaxed">
                  Growth-focused contractors need more than payment processing. They need visibility into what they are paying,
                  how money is moving, and where avoidable costs are hiding. 321 Swipe brings payment intelligence and human
                  support to the back-office side of growth.
                </p>
              </ScrollReveal>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {partnerCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                  whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" as const } }}
                  className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 transition-shadow cursor-default"
                >
                  <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-700 mb-4 group-hover:bg-navy-900 group-hover:text-white transition-colors">{card.icon}</div>
                  <h3 className="text-sm font-semibold text-navy-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{card.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <ReviewFindingsSection
          photo={photos.statement}
          title="What a 321 Swipe review actually looks for."
          body="Most contractors don't need another processor pitch. They need someone to translate the statement, identify the leaks, and explain what should change."
          findings={diagnostics}
          cta={{ label: "Get your free review", onClick: openModal }}
          background="surface"
        />

        <SavingsCalculator />

        <VerianSection
          photo={photos.analyst}
          title={<>Statement analysis that makes processing <span className="text-accent-400">easier to understand.</span></>}
          body="Verian is 321 Swipe's payment intelligence platform. It turns processor statements into plain-English insights, clear fee visibility, and concrete savings opportunities."
          bullets={verianBullets}
          cta={{ label: "See what we'd find in your statement", onClick: openModal }}
        />

        <AdvisorSection
          advisorPhoto={photos.advisor}
          secondaryPhoto={photos["van-tailgate"]}
          secondaryAlt="An electrician and shop owner reviewing a tablet at the tailgate of their work van"
          body="Every contractor we work with gets more than a payment processor. They get a named advisor who picks up the phone, reviews their numbers, and brings savings opportunities before they have to ask."
          pillars={pillars}
        />

        <ServicesGrid
          title="Everything a home service contractor needs to manage payments smarter."
          featured={[
            {
              icon: icon(<path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />, "w-6 h-6"),
              iconBg: "bg-emerald-600",
              title: "Statement analysis",
              subtitle: "Intelligence first",
              body: "Monthly reviews that translate fees, rates, and changes into plain English — with a human analyst on every review.",
              tags: ["Monthly human review", "Fee identification", "Rate guidance"],
              photo: { src: photos.analyst, alt: "A 321 Swipe analyst reviewing a processor statement on dual monitors", tone: "navy" },
            },
            {
              icon: icon(<><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></>, "w-6 h-6"),
              iconBg: "bg-accent-500",
              title: "Payment processing",
              subtitle: "The foundation",
              body: "Transparent processing for card, ACH, mobile, and online payments. Interchange-plus pricing. Next-day funding. No hidden rate creep.",
              tags: ["All card types", "Next-day funding", "Interchange-plus"],
              photo: { src: photos["porch-payment"], alt: "A homeowner tapping a card on a handheld terminal held by a technician on a front porch", tone: "warm" },
            },
          ]}
          supporting={supportingServices}
        />

        <ClosingCta
          photo={photos["van-dusk"]}
          badge="Free for Blue Collar Success Group members"
          title="Blue Collar Success Group members: see what your processor statement is really telling you."
          body="Send us a recent statement. We'll review it, explain what you're paying, identify potential savings opportunities, and show you where your payment setup can improve."
          primary={{ label: "Request a Free Statement Review", onClick: openModal }}
          trustPoints={["No long-term contracts", "Free review", "Human-reviewed", "Built for contractors"]}
        />
      </main>
    </>
  );
}
