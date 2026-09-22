"use client";
import { openChat } from "@/app/lib/chat";

import Image from "next/image";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { PhotoFrame } from "@/app/components/ui/PhotoFrame";
import { SubpageHeader } from "@/app/components/navigation/SubpageHeader";
import { SplitPhotoHero } from "@/app/components/hero/SplitPhotoHero";
import { ReviewFindingsSection } from "@/app/components/sections/ReviewFindingsSection";
import { VerianSection } from "@/app/components/sections/VerianSection";
import { AdvisorSection } from "@/app/components/sections/AdvisorSection";
import { ServicesGrid } from "@/app/components/sections/ServicesGrid";
import { ClosingCta } from "@/app/components/sections/ClosingCta";
import { WorkflowReview } from "./WorkflowReview";
import { EASE } from "@/app/lib/animations";
import type { PhotoMap } from "@/app/lib/photos";

// ── Helpers ───────────────────────────────────────────────────────────────────
const openModal = () => window.dispatchEvent(new Event("open-lead-modal"));


const icon = (d: React.ReactNode, size = "w-5 h-5") => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={size}>{d}</svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const integrationCards = [
  { icon: icon(<><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" /></>),
    title: "Connected payment workflows",
    body: "Support payment activity around the systems and processes your team already uses — without adding unnecessary back-office complexity." },
  { icon: icon(<><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>),
    title: "Cleaner back-office visibility",
    body: "Give owners and office teams a clearer view of payments, deposits, fees, and funding activity — all in one place." },
  { icon: icon(<path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />),
    title: "Statement review built in",
    body: "Monthly reviews identify hidden fees, pricing changes, and avoidable processing costs — delivered to you proactively." },
  { icon: icon(<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>),
    title: "Human support when it matters",
    body: "A real advisor explains what changed, what it means, and what should happen next — in plain language you can act on." },
];

const flowSteps = [
  { label: "CertainPath\nsoftware", note: "Your operations hub",   icon: icon(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></>, "w-6 h-6") },
  { label: "Payment\nactivity",     note: "Jobs, invoices, ACH",    icon: icon(<><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></>, "w-6 h-6") },
  { label: "Deposit\nvisibility",   note: "Funding clarity",        icon: icon(<><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /></>, "w-6 h-6") },
  { label: "Statement\nreview",     note: "Human-reviewed monthly", icon: icon(<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>, "w-6 h-6") },
  { label: "Savings\ninsights",     note: "Fees found & fixed",     icon: icon(<path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />, "w-6 h-6") },
];

const problems = [
  { icon: icon(<><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" /></>), title: "Disconnected payment data", body: "Payments, deposits, and job activity become hard to reconcile when systems don't talk to each other." },
  { icon: icon(<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />), title: "Confusing processor statements", body: "Fees, markups, downgrades, and rate changes are buried in complex monthly statements that take time to decode." },
  { icon: icon(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>), title: "Funding questions", body: "Owners need to know when money hits the bank, what was deducted, and why — without digging through reports." },
  { icon: icon(<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /><path d="M3 3l18 18" /></>), title: "Limited cost visibility", body: "Without a clear effective rate and fee review, it's hard to know whether processing costs are fair or quietly growing." },
];

const diagnostics = [
  { icon: icon(<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>, "w-4 h-4"), title: "Markup creep", body: "Processor markups that quietly increase after the original agreement — often without notice." },
  { icon: icon(<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>, "w-4 h-4"), title: "Hidden monthly fees", body: "PCI fees, batch fees, statement fees, access fees, and other line items that compound quietly." },
  { icon: icon(<><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>, "w-4 h-4"), title: "Interchange downgrades", body: "Transactions routing at higher-cost categories due to setup, card type, or missing data." },
  { icon: icon(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, "w-4 h-4"), title: "Funding delays", body: "Deposits arriving slower than standard — creating cash-flow drag on completed jobs." },
  { icon: icon(<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>, "w-4 h-4"), title: "Workflow gaps", body: "Manual collection steps, missed invoice payments, or disconnected payment and job data." },
  { icon: icon(<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>, "w-4 h-4"), title: "Contract traps", body: "Long-term terms, liquidated damages, auto-renewals, and cancellation penalties in the fine print." },
];

const verianBullets = ["Monthly statement review", "Hidden fee detection", "Effective rate visibility", "Funding and deposit clarity", "Workflow improvement opportunities", "Human-reviewed findings"];

const pillars = [
  { number: "01", title: "One advisor who picks up.", body: "Every client gets a dedicated account manager who knows your business and picks up the phone directly — not a 1-800 number or a support ticket." },
  { number: "02", title: "Monthly statement reviews. Without being asked.", body: "We review your processor statement every month and bring findings to you — fee changes, rate movements, unusual items — before you have to ask." },
  { number: "03", title: "Workflow guidance around your systems.", body: "CertainPath members run complex operations. We help payment workflows fit the systems and processes your team already relies on." },
  { number: "04", title: "Ongoing strategy. Not a one-time sale.", body: "As your business grows, your payment setup should evolve. We check in regularly and make sure you are never paying more than you should." },
];

const supportingServices = [
  { title: "Payment processing", body: "Transparent processing for card, ACH, mobile, and online payments. Interchange-plus pricing. Next-day funding.", icon: icon(<><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></>) },
  { title: "Funding visibility", body: "Clearer understanding of deposits, batches, funding timing, and daily payment activity.", icon: icon(<><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></>) },
  { title: "Mobile payments", body: "Tap-to-pay, digital invoices, and field receipts — built for crews on-site, not just the office.", icon: icon(<><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>) },
  { title: "Recurring billing", body: "Support for maintenance agreements, memberships, and recurring service plans. Set up once, collect reliably.", icon: icon(<path d="M21 12a9 9 0 11-3-6.7M21 3v6h-6" />) },
  { title: "Surcharging", body: "Compliance-aware surcharge guidance that offsets processing costs while protecting the customer experience.", icon: icon(<path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />) },
];

// ── Hero visual: member payment overview ──────────────────────────────────────
function MemberOverviewCard() {
  const status = [
    { label: "Payment data synced",   value: "Active",  cls: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Statement review ready", value: "Ready",   cls: "text-accent-600 bg-accent-50 border-accent-100" },
    { label: "Deposit visibility",     value: "Clear",   cls: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Hidden fees found",      value: "3 items", cls: "text-amber-600 bg-amber-50 border-amber-100" },
  ];
  return (
    <div className="relative select-none">
      <motion.div animate={{ y: [0, -9, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}>
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 0 0 1px rgba(12,21,36,0.06), 0 16px 48px rgba(12,21,36,0.18), 0 40px 90px rgba(37,99,235,0.12)" }}
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <div>
              <p className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-[0.08em]">Payment intelligence</p>
              <p className="text-[13px] font-bold text-navy-900 mt-0.5">CertainPath member overview</p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">Review active</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-3 divide-x divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {[
                { label: "Job payments", value: "$54,800", delta: "+9%" },
                { label: "Jobs funded",  value: "211",     delta: "+6%" },
                { label: "Avg. job",     value: "$260",    delta: "+3%" },
              ].map((s) => (
                <div key={s.label} className="px-3.5 py-3">
                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.06em]">{s.label}</p>
                  <p className="text-[14px] font-bold text-navy-900 mt-0.5 tabular-nums">{s.value}</p>
                  <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">{s.delta}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl p-3 bg-slate-50 border border-slate-200">
                <p className="text-[8.5px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Current rate</p>
                <p className="text-[20px] font-bold tabular-nums leading-none text-slate-700">3.18%</p>
                <p className="text-[8.5px] text-slate-400 mt-0.5">Before review</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.18)" }}>
                <p className="text-[8.5px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Optimized rate</p>
                <p className="text-[20px] font-bold tabular-nums leading-none text-accent-600">2.44%</p>
                <p className="text-[8.5px] text-slate-400 mt-0.5">After review</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Workflow status</p>
              {status.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-[11px] text-slate-500">{item.label}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.cls}`}>{item.value}</span>
                </div>
              ))}
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
            <p className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">3 fee issues found · est. $590/mo</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function CertainPathPage({ photos }: { photos: PhotoMap }) {
  return (
    <>
      <SubpageHeader
        label="Member Page"
        partnerLogo={{ src: "/certainpath-logo.svg", alt: "CertainPath" }}
        cta={{ label: "Request a Review", onClick: openModal }}
      />

      <main>
        <SplitPhotoHero
          badge={
            <span className="inline-flex items-center gap-2.5 rounded-full border border-navy-100 bg-navy-50/90 px-3.5 py-2 shadow-sm">
              <Image src="/certainpath-logo.svg" alt="CertainPath" width={100} height={24} style={{ height: "18px", width: "auto" }} />
              <span className="w-px h-3.5 bg-slate-300/70" />
              <span className="text-xs font-semibold text-navy-700">Member Page</span>
            </span>
          }
          lines={["Payment intelligence", "for CertainPath", "members."]}
          body="321 Swipe helps CertainPath members simplify payments, review merchant statements, uncover hidden fees, and improve payment visibility — with workflows designed around the software and systems your team already uses."
          primary={{ label: "Request a Free Statement Review", onClick: openModal }}
          secondary={{ label: "Review My Payment Workflow", onClick: openChat }}
          trustItems={[
            { strong: "Built", label: "for home service contractors" },
            { strong: "Integrated", label: "payment workflows" },
            { strong: "Independent,", label: "not PE-owned" },
          ]}
          photo={{
            src: photos["van-tailgate"],
            alt: "An electrician and shop owner reviewing a tablet at the tailgate of their work van",
            brief: "Electrician and shop owner reviewing a tablet at the tailgate of a work van, early morning.",
            position: "62% 30%",
            tone: "light",
          }}
          visual={<MemberOverviewCard />}
        />

        {/* ── Software-connected workflows ── */}
        {/* TODO: Verify exact CertainPath integration capabilities and update this section with approved technical language before publishing. */}
        <section className="py-24 lg:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <ScrollReveal>
                <div className="flex items-center justify-center gap-3 mb-5">
                  <Image src="/logo-dark.svg" alt="321 Swipe" width={90} height={36} style={{ height: "26px", width: "auto" }} />
                  <span className="text-slate-300 text-lg">×</span>
                  <Image src="/certainpath-logo.svg" alt="CertainPath" width={110} height={28} style={{ height: "22px", width: "auto" }} />
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500">Software-connected workflows</span>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-navy-900 leading-tight tracking-tight">
                  Payments that fit the way CertainPath members already operate.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.16}>
                <p className="mt-4 text-base text-slate-500 leading-relaxed">
                  Your payment system should not create extra back-office work. 321 Swipe connects processing, statement review,
                  funding visibility, and contractor workflows around the systems your team already relies on.
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.12}>
              <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8" style={{ boxShadow: "0 2px 12px rgba(12,21,36,0.05)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 text-center mb-6">How 321 Swipe connects to your workflow</p>
                <div className="flex flex-col sm:flex-row items-center justify-center py-2">
                  {flowSteps.map((step, i) => (
                    <div key={step.label} className="flex flex-col sm:flex-row items-center">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.4, ease: EASE }}
                        className="flex flex-col items-center text-center"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-700 mb-2">{step.icon}</div>
                        <p className="text-[11px] font-semibold text-navy-900 leading-tight whitespace-pre-line">{step.label}</p>
                        <p className="text-[9.5px] text-slate-400 mt-0.5">{step.note}</p>
                      </motion.div>
                      {i < flowSteps.length - 1 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-slate-300 rotate-90 sm:rotate-0 mx-4 my-2 sm:my-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {integrationCards.map((card, i) => (
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

        {/* ── The status quo ── */}
        <section className="py-24 lg:py-28 bg-surface border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
              <ScrollReveal direction="left">
                <PhotoFrame
                  src={photos.problem}
                  alt="A plumbing company owner reading a long processor statement at his shop desk"
                  brief="Plumbing company owner at a shop desk holding a multi-page processor statement."
                  tone="light"
                  motion="parallax"
                  position="38% 50%"
                  className="h-[420px] lg:h-[520px] rounded-[20px]"
                  style={{ boxShadow: "0 24px 60px rgba(12,21,36,0.12)" }}
                />
              </ScrollReveal>
              <div>
                <ScrollReveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">The status quo</span>
                </ScrollReveal>
                <ScrollReveal delay={0.08}>
                  <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-tight tracking-tight">
                    Payment processing should not slow down a growing home service business.
                  </h2>
                </ScrollReveal>
                <ScrollReveal delay={0.16}>
                  <p className="mt-4 text-base text-slate-500 leading-relaxed max-w-lg">
                    Many contractors have strong operational systems but weak visibility into processing costs, funding timing,
                    and payment activity. That gap quietly costs money and creates unnecessary back-office work.
                  </p>
                </ScrollReveal>
                <div className="mt-9 grid sm:grid-cols-2 gap-4">
                  {problems.map((p, i) => (
                    <motion.div
                      key={p.title}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" as const } }}
                      className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-slate-100 hover:border-slate-300 transition-shadow cursor-default"
                    >
                      <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-700 mb-3.5 group-hover:bg-navy-900 group-hover:text-white transition-colors">{p.icon}</div>
                      <h3 className="text-sm font-semibold text-navy-900 mb-1.5">{p.title}</h3>
                      <p className="text-[13.5px] text-slate-500 leading-relaxed">{p.body}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <ReviewFindingsSection
          photo={photos.statement}
          title="What a 321 Swipe review actually looks for."
          body="Members don't need another processor pitch. They need someone to sit with the statement, point at the leaks, and say in plain terms what should change."
          findings={diagnostics}
          cta={{ label: "Get your free review", onClick: openModal }}
          secondary={{ label: "See a member statement decoded", href: "/certainpath/statement-decoder" }}
        />

        <WorkflowReview />

        <VerianSection
          photo={photos.analyst}
          title={<>Statement analysis that connects payment data <span className="text-accent-400">to better decisions.</span></>}
          body="Verian is 321 Swipe's payment intelligence platform. It turns processor statements, payment activity, and fee data into plain-English insights, clear cost visibility, and concrete savings opportunities."
          bullets={verianBullets}
          cta={{ label: "See what we'd find in your statement", onClick: openModal }}
        />

        <AdvisorSection
          advisorPhoto={photos.advisor}
          secondaryPhoto={photos["roofing-crew"]}
          secondaryAlt="A roofing crew at work at golden hour while the foreman checks his phone"
          body="Every CertainPath member working with 321 Swipe gets more than payment processing. They get a named advisor who understands contractor operations, reviews the numbers, and helps translate payment data into practical business decisions."
          pillars={pillars}
        />

        <ServicesGrid
          title="Payment support built for home service contractors."
          featured={[
            {
              icon: icon(<path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />, "w-6 h-6"),
              iconBg: "bg-emerald-600",
              title: "Statement analysis",
              subtitle: "Intelligence first",
              body: "Each month an analyst reads the statement, marks what changed, and tells the office what it means — before anyone has to ask.",
              tags: ["Monthly review", "Fee identification", "Rate guidance"],
              photo: { src: photos.analyst, alt: "A 321 Swipe analyst reviewing a processor statement on dual monitors", tone: "navy" },
            },
            {
              icon: icon(<><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" /></>, "w-6 h-6"),
              iconBg: "bg-accent-500",
              // TODO: Verify exact CertainPath integration capabilities before publishing.
              title: "CertainPath workflow support",
              subtitle: "Software-connected",
              body: "Payment workflows designed to support the systems and processes CertainPath members already use — reducing back-office friction and improving visibility.",
              tags: ["Workflow integration", "Back-office clarity", "Deposit visibility"],
              photo: { src: photos["porch-payment"], alt: "A homeowner tapping a card on a handheld terminal held by a technician on a front porch", tone: "warm" },
            },
          ]}
          supporting={supportingServices}
        />

        <ClosingCta
          photo={photos["van-dusk"]}
          badge="Free for CertainPath members"
          title="CertainPath members: see what your payment setup is really costing you."
          body="Send us a recent processor statement and tell us how your payment workflow is set up. We'll review the numbers, look for hidden fees and pricing issues, and show where your payment operation can become clearer, cleaner, and more profitable."
          primary={{ label: "Request a Free CertainPath Member Review", onClick: openModal }}
          trustPoints={["Free for members", "Reviewed by an analyst", "Built for the trades", "Month-to-month terms"]}
        />
      </main>
    </>
  );
}
