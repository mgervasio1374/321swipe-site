"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";

// ── Helpers ───────────────────────────────────────────────────────────────────
const openModal = () => window.dispatchEvent(new Event("open-lead-modal"));
const openChat  = () => (window as any).Tawk_API?.maximize?.();
const fmt       = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

// ── Data ──────────────────────────────────────────────────────────────────────
const proofItems = [
  { strong: "Built", rest: "for home service contractors" },
  { strong: "Integrated", rest: "payment workflows" },
  { strong: "Real reviews", rest: "by real advisors" },
  { strong: "Independent,", rest: "not PE-owned" },
];

const integrationCards = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
        <path d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
      </svg>
    ),
    title: "Connected Payment Workflows",
    body: "Support payment activity around the systems and processes your team already uses — without adding unnecessary back-office complexity.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "Cleaner Back-Office Visibility",
    body: "Give owners and office teams a clearer view of payments, deposits, fees, and funding activity — all in one place.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Statement Review Built In",
    body: "Monthly reviews identify hidden fees, pricing changes, and avoidable processing costs — delivered to you proactively.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: "Human Support When It Matters",
    body: "A real advisor explains what changed, what it means, and what should happen next — in plain language you can act on.",
  },
];

const problems = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"/><path d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"/></svg>,
    title: "Disconnected Payment Data",
    body: "Payments, deposits, and job activity can become difficult to reconcile when systems do not communicate clearly.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
    title: "Confusing Processor Statements",
    body: "Fees, markups, downgrades, and rate changes are buried in complex monthly statements that take time to decode.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    title: "Funding Questions",
    body: "Owners need to know when money is hitting the bank, what was deducted, and why — without digging through reports.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 3l18 18M10.5 10.677a2 2 0 002.823 2.823M7.362 7.561A7.03 7.03 0 0012 6c3.866 0 7 3.134 7 7a7.03 7.03 0 01-.44 2.458"/></svg>,
    title: "Limited Cost Visibility",
    body: "Without a clear effective rate and fee review, it is hard to know whether processing costs are fair or quietly growing.",
  },
];

const diagnostics = [
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, title: "Markup Creep", body: "Processor markups that quietly increase after the original agreement — often without notice." },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, title: "Hidden Monthly Fees", body: "PCI fees, batch fees, statement fees, access fees, and other line items that compound quietly." },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>, title: "Interchange Downgrades", body: "Transactions routing at higher-cost categories due to setup, card type, or missing data." },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: "Funding Delays", body: "Deposits arriving slower than standard — creating cash-flow drag on completed jobs." },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, title: "Workflow Gaps", body: "Manual collection steps, missed invoice payments, or disconnected payment and job data." },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, title: "Contract Traps", body: "Long-term terms, liquidated damages, auto-renewals, and cancellation penalties in the fine print." },
];

const verianBullets = [
  "Monthly statement review",
  "Hidden fee detection",
  "Effective rate visibility",
  "Funding and deposit clarity",
  "Workflow improvement opportunities",
  "Human-reviewed findings",
];

const advisorCards = [
  { num: "01", icon: "👤", title: "A Named Advisor. Not a Call Center.", body: "Every client gets a dedicated account manager who knows your business and picks up the phone directly — not a 1-800 number or a support ticket." },
  { num: "02", icon: "📋", title: "Monthly Statement Reviews. Without Being Asked.", body: "We review your processor statement every month and bring findings to you — fee changes, rate movements, unusual items — before you have to ask." },
  { num: "03", icon: "⚙️", title: "Workflow Guidance Around Your Systems.", body: "We understand that CertainPath members run complex operations. We help payment workflows fit the systems and processes your team already relies on." },
  { num: "04", icon: "📈", title: "Ongoing Strategy. Not a One-Time Sale.", body: "As your business grows, your payment setup should evolve. We check in regularly and make sure you are never paying more than you should." },
];

const featuredServices = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
    title: "Statement Analysis", subtitle: "Intelligence first",
    body: "Monthly reviews that translate fees, rates, and changes into plain English — with a human analyst on every review.",
    tags: ["Monthly human review", "Fee identification", "Rate guidance"],
    accent: "from-emerald-50/60 to-teal-50/30", iconBg: "bg-emerald-600",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"/><path d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"/></svg>,
    // TODO: Verify exact CertainPath integration capabilities and update this card with approved technical language before publishing.
    title: "CertainPath Workflow Support", subtitle: "Software-connected",
    body: "Payment workflows designed to support the systems and processes CertainPath members already use — reducing back-office friction and improving visibility.",
    tags: ["Workflow integration", "Back-office clarity", "Deposit visibility"],
    accent: "from-navy-50 to-accent-50/40", iconBg: "bg-accent-500",
  },
];

const supportingServices = [
  { title: "Payment Processing", body: "Transparent processing for card, ACH, mobile, and online payments. Interchange-plus pricing. Next-day funding. No hidden rate creep.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { title: "Funding Visibility", body: "Clearer understanding of deposits, batches, funding timing, and daily payment activity.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
  { title: "Mobile Payments", body: "Tap-to-pay, digital invoices, and field receipts — built for crews on-site, not just the office.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> },
  { title: "Recurring Billing", body: "Support for maintenance agreements, memberships, and recurring service plans. Set up once, collect reliably.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg> },
  { title: "Surcharging", body: "Compliance-aware surcharge program guidance designed to help offset processing costs while protecting the customer experience.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
];

// ── Connected Payment Dashboard Visual ────────────────────────────────────────
function PaymentDashboardVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
      className="relative w-full max-w-[480px] mx-auto select-none"
    >
      {/* Floating badge — workflow connected */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 1.1, ease: EASE }}
        className="absolute -top-4 -right-3 bg-white rounded-xl px-3 py-2 flex items-center gap-2 z-10"
        style={{ boxShadow: "0 4px 16px rgba(12,21,36,0.09), 0 0 0 1px rgba(12,21,36,0.05)" }}
      >
        <div className="w-5 h-5 rounded-md bg-accent-500 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-2.5 h-2.5 text-white">
            <path d="M7.5 1.5a.5.5 0 011 0v3.793l1.146-1.147a.5.5 0 01.708.708l-2 2a.5.5 0 01-.708 0l-2-2a.5.5 0 01.708-.708L7.5 5.293V1.5z"/>
            <path d="M3 7.5A4.5 4.5 0 0112.5 11H11a3 3 0 10-6 0H3.5A4.5 4.5 0 013 7.5z"/>
          </svg>
        </div>
        <span className="text-[10px] font-semibold text-slate-600 whitespace-nowrap">Workflow connected</span>
      </motion.div>

      {/* Main card */}
      <div className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: ["0 0 0 1px rgba(12,21,36,0.06)", "0 4px 8px rgba(12,21,36,0.04)", "0 16px 48px rgba(12,21,36,0.10)", "0 32px 80px rgba(37,99,235,0.06)"].join(", ") }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-[0.08em]">Payment Intelligence</p>
            <p className="text-[13px] font-bold text-navy-900 mt-0.5">CertainPath Member Overview</p>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
            Review Active
          </span>
        </div>

        <div className="p-5 space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {[
              { label: "Job Payments", value: "$54,800", delta: "+9%" },
              { label: "Jobs Funded",  value: "211",     delta: "+6%" },
              { label: "Avg. Job",     value: "$260",    delta: "+3%" },
            ].map((s) => (
              <div key={s.label} className="px-3.5 py-3">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.06em]">{s.label}</p>
                <p className="text-[14px] font-bold text-navy-900 mt-0.5 tabular-nums">{s.value}</p>
                <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">{s.delta}</p>
              </div>
            ))}
          </div>

          {/* Rate review */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Current Rate",  value: "3.18%", accent: false, sub: "Before review" },
              { label: "Optimized Rate", value: "2.44%", accent: true,  sub: "After review" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-3"
                style={{
                  background: item.accent ? "rgba(37,99,235,0.06)" : "rgba(248,250,252,1)",
                  border: item.accent ? "1px solid rgba(37,99,235,0.18)" : "1px solid rgba(226,232,240,1)",
                }}
              >
                <p className="text-[8.5px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                <p className={`text-[20px] font-bold tabular-nums leading-none ${item.accent ? "text-accent-600" : "text-slate-700"}`}>{item.value}</p>
                <p className="text-[8.5px] text-slate-400 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Deposit / workflow status */}
          <div className="space-y-2">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">Workflow Status</p>
            {[
              { label: "Payment data synced",     status: "Active",   color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
              { label: "Statement review ready",   status: "Ready",    color: "text-accent-600 bg-accent-50 border-accent-100" },
              { label: "Deposit visibility",       status: "Clear",    color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
              { label: "Hidden fees found",        status: "3 items",  color: "text-amber-600 bg-amber-50 border-amber-100" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-[11px] text-slate-500">{item.label}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>

          {/* Recent transactions */}
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Recent</p>
            <div className="space-y-1.5">
              {[
                { name: "Apex Roofing LLC",      type: "Invoice Paid",    amount: "+$4,200", icon: "🏠" },
                { name: "Summit HVAC",           type: "ACH — Job Pymt",  amount: "+$2,850", icon: "❄️" },
                { name: "Precision Plumbing Co.", type: "Mobile Payment",  amount: "+$1,100", icon: "🔧" },
              ].map((tx) => (
                <div key={tx.name} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] shrink-0">{tx.icon}</span>
                    <div>
                      <p className="text-[10.5px] font-semibold text-navy-900 leading-none">{tx.name}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{tx.type}</p>
                    </div>
                  </div>
                  <span className="text-[10.5px] font-bold text-emerald-600 tabular-nums">{tx.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Savings chip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.4, ease: EASE }}
        className="absolute -bottom-4 -left-4 bg-white rounded-xl px-3.5 py-2.5 flex items-center gap-2.5"
        style={{ boxShadow: "0 6px 24px rgba(12,21,36,0.10), 0 0 0 1px rgba(12,21,36,0.05)" }}
      >
        <div className="w-7 h-7 rounded-full bg-accent-50 border border-accent-100 flex items-center justify-center text-sm shrink-0">💡</div>
        <div>
          <p className="text-[10px] font-bold text-navy-900 leading-none">Insight from 321 Swipe</p>
          <p className="text-[9.5px] text-slate-400 mt-0.5 whitespace-nowrap">3 fee issues found · est. $590/mo impact</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Integration Flow ───────────────────────────────────────────────────────────
function IntegrationFlow() {
  const steps = [
    { label: "CertainPath\nSoftware",   icon: "⚙️", note: "Your operations hub" },
    { label: "Payment\nActivity",       icon: "💳", note: "Jobs, invoices, ACH" },
    { label: "Deposit\nVisibility",     icon: "🏦", note: "Funding clarity" },
    { label: "Statement\nReview",       icon: "📋", note: "Human-reviewed monthly" },
    { label: "Savings\nInsights",       icon: "💡", note: "Fees found & fixed" },
  ];
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-0 overflow-x-auto py-2">
      {steps.map((step, i) => (
        <div key={step.label} className="flex flex-col sm:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: EASE }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm mb-2">
              {step.icon}
            </div>
            <p className="text-[11px] font-semibold text-navy-900 leading-tight whitespace-pre-line">{step.label}</p>
            <p className="text-[9.5px] text-slate-400 mt-0.5">{step.note}</p>
          </motion.div>
          {i < steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.15, duration: 0.3, ease: EASE }}
              className="flex sm:flex-row flex-col items-center mx-3 my-2 sm:my-0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-slate-300 rotate-90 sm:rotate-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Workflow Review Module ─────────────────────────────────────────────────────
const PAYMENT_TYPES = ["Card Present", "Mobile / Tap-to-pay", "Digital Invoice", "ACH / Bank Transfer", "Recurring Billing"];
const DEPOSIT_OPTS  = ["Clear — I know exactly what's coming", "Somewhat clear — I check but still have questions", "Unclear — I often don't know until it hits"];

function WorkflowReview() {
  const [step, setStep]             = useState<1 | 2 | 3>(1);
  const [volume, setVolume]         = useState(75000);
  const [rate, setRate]             = useState(3.0);
  const [payTypes, setPayTypes]     = useState<string[]>(["Card Present"]);
  const [depositVis, setDepositVis] = useState("");
  const [showResults, setShowResults] = useState(false);

  const improvement    = parseFloat(Math.min(rate * 0.18, 0.80).toFixed(2));
  const estOptRate     = parseFloat(Math.max(rate - improvement, 1.75).toFixed(2));
  const currentFees    = (volume * rate) / 100;
  const estOptFees     = (volume * estOptRate) / 100;
  const estSavings     = currentFees - estOptFees;

  const visScore       = depositVis.startsWith("Clear") ? "Strong" : depositVis.startsWith("Somewhat") ? "Moderate" : depositVis ? "Needs Attention" : "—";
  const visColor       = depositVis.startsWith("Clear") ? "text-emerald-600" : depositVis.startsWith("Somewhat") ? "text-amber-600" : depositVis ? "text-red-500" : "text-slate-400";
  const priority       = rate > 3.2 ? "High" : rate > 2.5 ? "Medium" : "Low";
  const priorityColor  = rate > 3.2 ? "text-red-500" : rate > 2.5 ? "text-amber-600" : "text-emerald-600";

  const togglePayType = (t: string) =>
    setPayTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const stepLabel = ["", "Your Current Setup", "Payment Workflow", "Opportunities Found"];

  return (
    <section className="py-24 lg:py-28 bg-surface border-t border-slate-100">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-5">
              Workflow + payment review
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-tight tracking-tight">
              See where your payment workflow may be leaking money.
            </h2>
            <p className="mt-4 text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
              Walk through your current setup in three steps. We'll highlight where the biggest opportunities are.
            </p>
          </div>
        </ScrollReveal>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {([1, 2, 3] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStep(s); if (s < 3) setShowResults(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                step === s
                  ? "bg-navy-900 text-white"
                  : s < step
                  ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  : "bg-slate-50 text-slate-300 cursor-default"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step === s ? "bg-white/20" : s < step ? "bg-emerald-500 text-white" : "bg-slate-200"}`}>
                {s < step ? "✓" : s}
              </span>
              {stepLabel[s]}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
          style={{ boxShadow: "0 4px 24px rgba(12,21,36,0.06), 0 1px 4px rgba(12,21,36,0.04)" }}
        >
          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25, ease: EASE }}
                className="p-8 grid lg:grid-cols-2 gap-8"
              >
                <div>
                  <p className="text-sm font-semibold text-navy-900 mb-6">Current processing setup</p>
                  <div className="space-y-7">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Monthly Processing Volume</label>
                        <span className="text-sm font-bold text-navy-900 tabular-nums">${fmt(volume)}</span>
                      </div>
                      <input type="range" min={5000} max={500000} step={5000} value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-full accent-accent-500 cursor-pointer" />
                      <div className="flex justify-between text-[10px] text-slate-300 mt-1"><span>$5k</span><span>$500k</span></div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Effective Rate</label>
                        <span className="text-sm font-bold text-navy-900 tabular-nums">{rate.toFixed(2)}%</span>
                      </div>
                      <input type="range" min={1.5} max={5.5} step={0.05} value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="w-full accent-accent-500 cursor-pointer" />
                      <div className="flex justify-between text-[10px] text-slate-300 mt-1"><span>1.50%</span><span>5.50%</span></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quick estimate</p>
                    <div className="rounded-xl p-4 bg-slate-50 border border-slate-100">
                      <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Current Monthly Fees</p>
                      <p className="text-2xl font-bold text-slate-700 tabular-nums">${fmt(currentFees)}</p>
                    </div>
                    <div className="rounded-xl p-4" style={{ background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.14)" }}>
                      <p className="text-[9px] font-semibold uppercase tracking-widest text-accent-500 mb-1">Est. Monthly Savings Opportunity</p>
                      <p className="text-2xl font-bold text-navy-900 tabular-nums">${fmt(estSavings)}<span className="text-sm font-normal text-slate-400">/mo</span></p>
                      <p className="text-[9px] text-slate-400 mt-1">assuming ~{improvement.toFixed(2)}% rate improvement</p>
                    </div>
                  </div>
                  <button onClick={() => setStep(2)}
                    className="mt-4 w-full rounded-lg bg-navy-900 text-white text-sm font-semibold py-3 hover:bg-navy-800 transition-colors flex items-center justify-center gap-2">
                    Next: Payment Workflow
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70"><path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25, ease: EASE }}
                className="p-8 grid lg:grid-cols-2 gap-8"
              >
                <div>
                  <p className="text-sm font-semibold text-navy-900 mb-5">How do you collect payments?</p>
                  <div className="space-y-2.5">
                    {PAYMENT_TYPES.map((t) => (
                      <label key={t} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${payTypes.includes(t) ? "border-accent-300 bg-accent-50/50" : "border-slate-200 hover:border-slate-300"}`}>
                        <input type="checkbox" checked={payTypes.includes(t)} onChange={() => togglePayType(t)} className="accent-accent-500 w-4 h-4" />
                        <span className="text-sm text-navy-900 font-medium">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-semibold text-navy-900 mb-5">Deposit visibility</p>
                    <div className="space-y-2.5">
                      {DEPOSIT_OPTS.map((o) => (
                        <label key={o} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${depositVis === o ? "border-accent-300 bg-accent-50/50" : "border-slate-200 hover:border-slate-300"}`}>
                          <input type="radio" name="deposit" checked={depositVis === o} onChange={() => setDepositVis(o)} className="accent-accent-500 w-4 h-4" />
                          <span className="text-sm text-navy-900">{o}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-navy-50 border border-navy-100">
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-accent-500 shrink-0">
                        <path fillRule="evenodd" d="M8 .5a7.5 7.5 0 100 15A7.5 7.5 0 008 .5zm3.25 4.94a.75.75 0 010 1.06L7.06 10.69a.75.75 0 01-1.06 0L4.75 9.44a.75.75 0 011.06-1.06l.72.72 3.66-3.66a.75.75 0 011.06 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-navy-700 font-medium">Using CertainPath software</span>
                    </div>
                  </div>
                  <button onClick={() => { setStep(3); setShowResults(true); }}
                    className="mt-4 w-full rounded-lg text-white text-sm font-semibold py-3 transition-colors flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)" }}>
                    See Opportunities Found
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70"><path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Results */}
            {step === 3 && showResults && (
              <motion.div key="step3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}
                className="p-8"
              >
                <p className="text-sm font-semibold text-navy-900 mb-6">Opportunities found</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Est. Monthly Savings", value: `$${fmt(estSavings)}`, sub: `~${improvement.toFixed(2)}% improvement`, color: "text-navy-900", accent: true },
                    { label: "Rate Review Priority", value: priority, sub: `Current rate ${rate.toFixed(2)}%`, color: priorityColor, accent: false },
                    { label: "Deposit Visibility", value: visScore, sub: "Based on your input", color: visColor, accent: false },
                    { label: "Payment Types", value: `${payTypes.length}`, sub: "types in use — reviewed", color: "text-accent-600", accent: false },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl p-4"
                      style={{
                        background: item.accent ? "linear-gradient(135deg, rgba(37,99,235,0.07) 0%, rgba(37,99,235,0.03) 100%)" : "rgba(248,250,252,1)",
                        border: item.accent ? "1px solid rgba(37,99,235,0.14)" : "1px solid rgba(226,232,240,1)",
                      }}
                    >
                      <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                      <p className={`text-xl font-bold tabular-nums ${item.color}`}>{item.value}</p>
                      <p className="text-[9.5px] text-slate-400 mt-1">{item.sub}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-4 mb-5">
                  Estimates are for illustration only. A real statement and workflow review is required to confirm actual savings opportunities. Results vary based on volume, card mix, processor, and current pricing.
                </p>
                <button onClick={openModal}
                  className="w-full rounded-lg text-white text-sm font-semibold py-3.5 transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)", boxShadow: "0 1px 4px rgba(37,99,235,0.3)" }}>
                  Request My CertainPath Member Review →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CertainPathPage() {
  return (
    <>
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100/80"
        style={{ boxShadow: "0 1px 20px rgba(12,21,36,0.05)" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-[60px] items-center justify-between gap-6">
            <a href="/" className="shrink-0">
              {/* TODO: Replace logo-dark.svg with a higher-resolution or simplified horizontal web logo when available */}
              <Image src="/logo-dark.svg" alt="321 Swipe" width={128} height={51}
                style={{ height: "auto", maxHeight: "34px", width: "auto" }} priority />
            </a>
            <span className="hidden sm:block text-[12px] font-medium text-slate-400 flex-1">For CertainPath Members</span>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={openChat} className="hidden md:block text-[13px] font-medium text-slate-500 hover:text-navy-900 px-3 py-2 transition-colors">
                Talk to 321 Swipe
              </button>
              <button onClick={openModal} className="inline-flex items-center justify-center gap-1.5 rounded-lg text-white text-[13px] font-semibold px-4 py-2 transition-colors"
                style={{ background: "linear-gradient(135deg, #0c1524 0%, #132040 100%)" }}>
                Request a Review
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-[90svh] flex items-center overflow-hidden bg-white">
          <div aria-hidden className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 55% at 30% 50%, rgba(37,99,235,0.04) 0%, transparent 65%)" }} />
          <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{ backgroundImage: "radial-gradient(circle, rgba(12,21,36,0.08) 1.2px, transparent 1.2px)", backgroundSize: "40px 40px" }} />

          <div className="relative w-full mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-24">
            <div className="grid lg:grid-cols-[1fr_1.15fr] items-center gap-12 lg:gap-8">
              <div className="flex flex-col items-start max-w-[520px]">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05, ease: EASE }}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50/90 px-3.5 py-1.5 text-xs font-semibold text-navy-700 mb-6 shadow-sm">
                    <span className="relative flex w-1.5 h-1.5">
                      <span className="live-ring absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-60" />
                      <span className="relative w-1.5 h-1.5 rounded-full bg-accent-500" />
                    </span>
                    For CertainPath Members
                  </span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.12, ease: EASE }}
                  className="font-bold tracking-[-0.035em] leading-[1.04]"
                  style={{ fontSize: "clamp(2.4rem, 5.2vw, 4.2rem)" }}
                >
                  <span className="block text-navy-700/80 font-semibold">Payment intelligence</span>
                  <span className="block" style={{ background: "linear-gradient(125deg, #1a3ed4 0%, #2563eb 30%, #3b82f6 60%, #93c5fd 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 1px 24px rgba(37,99,235,0.2))" }}>for CertainPath</span>
                  <span className="block text-navy-900">members.</span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
                  className="mt-5 text-[1rem] text-slate-500 leading-[1.72] max-w-[430px]">
                  321 Swipe helps CertainPath members simplify payments, review merchant statements, uncover hidden fees,
                  and improve payment visibility — with workflows designed around the software and systems your team already uses.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.36, ease: EASE }}
                  className="mt-7 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button onClick={openModal}
                    className="inline-flex items-center justify-center gap-2 rounded-lg text-white font-semibold text-sm px-6 py-3.5 transition-colors"
                    style={{ background: "linear-gradient(135deg, #0c1524 0%, #132040 100%)", boxShadow: "0 1px 4px rgba(12,21,36,0.28), 0 6px 20px rgba(12,21,36,0.14), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
                    Request a Free Statement Review
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-60"><path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" /></svg>
                  </button>
                  <button onClick={openChat}
                    className="inline-flex items-center justify-center gap-2 rounded-lg text-navy-900 font-medium text-sm px-6 py-3.5 border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-colors">
                    Review My Payment Workflow
                  </button>
                </motion.div>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.48, ease: EASE }}
                  className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-accent-400 shrink-0">
                    <path fillRule="evenodd" d="M8 .5a7.5 7.5 0 100 15A7.5 7.5 0 008 .5zm3.25 4.94a.75.75 0 010 1.06L7.06 10.69a.75.75 0 01-1.06 0L4.75 9.44a.75.75 0 011.06-1.06l.72.72 3.66-3.66a.75.75 0 011.06 0z" clipRule="evenodd" />
                  </svg>
                  Serving CertainPath members with contractor-first payment intelligence and software-connected workflows.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.54, ease: EASE }}
                  className="mt-6 pt-5 border-t border-slate-100/90 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                  {proofItems.map((item, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="font-semibold text-slate-600">{item.strong}</span>
                      <span>{item.rest}</span>
                      {i < proofItems.length - 1 && <span className="w-px h-3 bg-slate-200 ml-4 hidden sm:block" />}
                    </span>
                  ))}
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, x: 40, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                className="flex justify-center lg:justify-end lg:-mr-6">
                <PaymentDashboardVisual />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Integration Section ── */}
        {/* TODO: Verify exact CertainPath integration capabilities and update this section with approved technical language before publishing. */}
        <section className="py-20 lg:py-24 bg-surface border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-5">
                  Software-connected workflows
                </span>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-tight tracking-tight">
                  Payments that fit the way CertainPath members already operate.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.16}>
                <p className="mt-4 text-base text-slate-500 leading-relaxed">
                  Your payment system should not create extra back-office work. 321 Swipe helps connect processing,
                  statement review, funding visibility, and contractor workflows around the systems your team already relies on.
                </p>
              </ScrollReveal>
            </div>

            {/* Integration flow */}
            <ScrollReveal delay={0.12}>
              <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-10"
                style={{ boxShadow: "0 2px 12px rgba(12,21,36,0.05)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 text-center mb-6">How 321 Swipe connects to your workflow</p>
                <IntegrationFlow />
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {integrationCards.map((card, i) => (
                <motion.div key={card.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                  className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 transition-all cursor-default">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4 group-hover:bg-navy-50 group-hover:text-navy-700 transition-colors">
                    {card.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-navy-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{card.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Problem Section ── */}
        <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-5">The status quo</span>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-tight tracking-tight">
                  Payment processing should not slow down a growing home service business.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.16}>
                <p className="mt-4 text-base text-slate-500 leading-relaxed">
                  Many contractors have strong operational systems but weak visibility into processing costs, funding timing,
                  and payment activity. That gap quietly costs money and creates unnecessary back-office work.
                </p>
              </ScrollReveal>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {problems.map((p, i) => (
                <motion.div key={p.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                  className="group relative bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-100 hover:border-slate-300 transition-all cursor-default">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4 group-hover:bg-navy-50 group-hover:text-navy-700 transition-colors">{p.icon}</div>
                  <h3 className="text-sm font-semibold text-navy-900 mb-2">{p.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{p.body}</p>
                  <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Diagnostic Section ── */}
        <section className="py-20 lg:py-28 bg-surface border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_1.6fr] gap-16 items-start">
              <div className="lg:sticky lg:top-28">
                <ScrollReveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">Statement review</span>
                </ScrollReveal>
                <ScrollReveal delay={0.08}>
                  <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-[1.1] tracking-tight">
                    What a 321 Swipe review actually looks for.
                  </h2>
                </ScrollReveal>
                <ScrollReveal delay={0.16}>
                  <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-sm">
                    Most contractors don&apos;t need another processor pitch. They need someone to translate the statement,
                    identify the leaks, and explain what should change.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.24}>
                  <button onClick={openModal} className="mt-8 inline-flex items-center gap-2 rounded-lg bg-navy-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-navy-800 transition-colors">
                    Get your free review
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70"><path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" /></svg>
                  </button>
                </ScrollReveal>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {diagnostics.map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: i * 0.08, duration: 0.45, ease: EASE }}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition-all cursor-default">
                    <div className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-accent-500 mb-3.5 group-hover:border-accent-200 group-hover:bg-accent-50 transition-colors">{item.icon}</div>
                    <h3 className="text-sm font-semibold text-navy-900 mb-1.5">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Workflow Review Module ── */}
        <WorkflowReview />

        {/* ── Verian Section ── */}
        <section className="relative py-24 lg:py-32 overflow-hidden"
          style={{ background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 5%, #94a3b8 14%, #1e293b 26%, #0d1e3a 38%, #060d1c 52%)" }}>
          <div aria-hidden className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 50% at 20% 50%, rgba(37,99,235,0.14) 0%, transparent 60%)" }} />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-navy-700/60 bg-navy-800/40 px-3.5 py-1.5 text-xs font-semibold text-navy-100/90 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
                  Verian Intelligence Platform
                </span>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h2 className="text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-tight">
                  Statement analysis that connects payment data to better decisions.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.16}>
                <p className="mt-5 text-[15px] text-navy-100/70 leading-relaxed">
                  Verian is 321 Swipe&apos;s payment intelligence platform. It turns processor statements, payment activity,
                  and fee data into plain-English insights, clear cost visibility, and concrete savings opportunities.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.24}>
                <div className="mt-8 inline-flex flex-col items-start gap-3 rounded-2xl border border-navy-700/50 bg-navy-800/30 px-6 py-5 text-left">
                  {verianBullets.map((b) => (
                    <div key={b} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent-500/20 border border-accent-500/30 flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-2.5 h-2.5 text-accent-400"><path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-sm text-navy-100/80">{b}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.32}>
                <div className="mt-8">
                  <button onClick={openModal} className="inline-flex items-center gap-2 rounded-lg text-white text-sm font-semibold px-6 py-3 transition-opacity hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)", boxShadow: "0 1px 4px rgba(37,99,235,0.3)" }}>
                    See What We&apos;d Find in Your Statement
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70"><path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Human Advisor ── */}
        <section className="py-20 lg:py-28 bg-white border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl mb-14">
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">Human partnership</span>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-[1.1] tracking-tight">
                  Software can process payments.{" "}
                  <span className="text-slate-400 font-normal">It can&apos;t understand your business.</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.16}>
                <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-2xl">
                  Every CertainPath member working with 321 Swipe gets more than payment processing. They get a named advisor
                  who understands contractor operations, reviews the numbers, and helps translate payment data into practical
                  business decisions.
                </p>
              </ScrollReveal>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {advisorCards.map((card, i) => (
                <motion.div key={card.num} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                  className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-md transition-shadow cursor-default">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{card.icon}</span>
                    <span className="text-[10px] font-black text-slate-100 group-hover:text-navy-100 transition-colors tabular-nums">{card.num}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-navy-900 mb-2">{card.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{card.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services ── */}
        <section className="py-20 lg:py-28 bg-surface border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">Services</span>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-tight tracking-tight">
                  Payment support built for home service contractors.
                </h2>
              </ScrollReveal>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              {featuredServices.map((s, i) => (
                <motion.div key={s.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.12, duration: 0.5, ease: EASE }}
                  className={`group bg-gradient-to-br ${s.accent} rounded-2xl border border-slate-200 p-7 flex flex-col gap-5 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100/90 transition-shadow cursor-default`}>
                  <div className="flex items-start justify-between">
                    <div className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center text-white shadow-md`}>{s.icon}</div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white/70 px-2.5 py-1 rounded-full border border-slate-200/60">{s.subtitle}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{s.body}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-medium text-slate-500 bg-white/80 border border-slate-200/80 px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {supportingServices.map((s, i) => (
                <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.45, ease: EASE }}
                  className="group bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 hover:border-slate-300 hover:shadow-md transition-shadow cursor-default">
                  <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center text-navy-700 group-hover:bg-navy-900 group-hover:text-white transition-colors">{s.icon}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-navy-900 mb-1.5">{s.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{s.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="relative py-24 lg:py-36 overflow-hidden"
          style={{ background: "linear-gradient(180deg, #f8fafc 0%, #060d1c 6%)" }}>
          <div aria-hidden className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(37,99,235,0.15) 0%, transparent 55%)" }} />
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

          <div className="relative mx-auto max-w-3xl px-6 lg:px-8 text-center">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-navy-700 bg-navy-800/50 px-3.5 py-1.5 text-xs font-semibold text-navy-100 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
                Free for CertainPath members
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                CertainPath members: see what your payment setup is really costing you.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <p className="mt-6 text-base sm:text-lg text-navy-100/70 leading-relaxed max-w-2xl mx-auto">
                Send us a recent processor statement and tell us how your payment workflow is set up. We&apos;ll review
                the numbers, look for hidden fees and pricing issues, and show where your payment operation can become
                clearer, cleaner, and more profitable.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.24}>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={openModal}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-navy-900 font-semibold text-sm px-7 py-3.5 hover:bg-slate-50 transition-colors shadow-lg shadow-black/20">
                  Request a Free CertainPath Member Review
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" /></svg>
                </button>
                <button onClick={openChat} className="inline-flex items-center justify-center rounded-lg text-navy-100 font-medium text-sm px-7 py-3.5 hover:text-white hover:bg-white/10 transition-colors">
                  Talk to 321 Swipe
                </button>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.32}>
              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
                {["Free review", "Human-reviewed", "Built for contractors", "Software-connected workflow support", "No long-term contracts"].map((point) => (
                  <span key={point} className="flex items-center gap-1.5 text-xs text-navy-100/50">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-emerald-400 shrink-0"><path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" /></svg>
                    {point}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Footer */}
          <div className="relative mt-24 border-t border-navy-800/60">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-col items-center sm:items-start gap-1.5">
                {/* TODO: Replace logo-white.svg with higher-resolution horizontal web logo when available */}
                <Image src="/logo-white.svg" alt="321 Swipe" width={110} height={44}
                  className="opacity-60 hover:opacity-80 transition-opacity"
                  style={{ height: "auto", maxHeight: "30px", width: "auto" }} />
                <p className="text-[10px] text-navy-100/30">Independent, contractor-first payment intelligence.</p>
              </div>
              <p className="text-[11px] text-navy-100/25 text-center">
                © {new Date().getFullYear()} 321 Swipe.
                {/* TODO: Add required registered MSP/ISO disclosure once final legal language is provided */}
              </p>
              <div className="flex gap-5 text-xs text-navy-100/30">
                <a href="/" className="hover:text-navy-100/60 transition-colors">Home</a>
                <a href="#" className="hover:text-navy-100/60 transition-colors">Privacy</a>
                <a href="#" className="hover:text-navy-100/60 transition-colors">Terms</a>
                <a href="#" className="hover:text-navy-100/60 transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
