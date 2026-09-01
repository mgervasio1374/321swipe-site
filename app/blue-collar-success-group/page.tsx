"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";

// ── Helpers ───────────────────────────────────────────────────────────────────
const openModal  = () => window.dispatchEvent(new Event("open-lead-modal"));
const openChat   = () => (window as any).Tawk_API?.maximize?.();
const fmt        = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

// ── Data ──────────────────────────────────────────────────────────────────────
const proofItems = [
  { strong: "Independent,", rest: "not PE-owned" },
  { strong: "Real reviews", rest: "by real advisors" },
  { strong: "Built", rest: "for contractors" },
  { strong: "Month-to-month", rest: "relationships" },
];

const partnerCards = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Know what you're really paying",
    body: "We translate confusing processor statements into plain-English insights so you can see exactly what every fee means.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: "Find hidden fees and pricing issues",
    body: "We look for markups, interchange downgrades, monthly access fees, and avoidable costs hiding in your statement.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Improve payment visibility",
    body: "We help contractors understand deposits, funding timing, and payment activity — so cash flow is never a guessing game.",
  },
];

const diagnostics = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    title: "Markup Creep",
    body: "Processor markups that quietly increase after the original agreement — often without notice.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: "Hidden Monthly Fees",
    body: "PCI fees, batch fees, statement fees, access fees, and other line items that compound quietly.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
    title: "Interchange Downgrades",
    body: "Transactions routing at higher-cost categories due to setup, card type, or missing data.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    title: "Funding Delays",
    body: "Deposits arriving slower than standard — creating cash-flow drag on completed jobs.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    title: "Payment Workflow Gaps",
    body: "Manual collection steps, missed invoice payments, or disconnected job and payment data.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    title: "Contract Traps",
    body: "Long-term terms, liquidated damages, auto-renewals, and cancellation penalties buried in the fine print.",
  },
];

const verianBullets = [
  "Monthly statement review",
  "Hidden fee detection",
  "Rate optimization guidance",
  "Funding and deposit visibility",
  "Human-reviewed findings",
];

const advisorCards = [
  {
    num: "01", icon: "👤",
    title: "A Named Advisor. Not a Call Center.",
    body: "Every client gets a dedicated account manager who knows your business. When you have a question, you call them directly — not a 1-800 number.",
  },
  {
    num: "02", icon: "📋",
    title: "Monthly Statement Reviews. Without Being Asked.",
    body: "We review your processor statement every month and bring findings to you — new fees, rate changes, unusual activity — before you have to ask.",
  },
  {
    num: "03", icon: "⚡",
    title: "Setup Done Right. Fast.",
    body: "We handle equipment, integrations, and testing. Most clients are live in under a week with zero downtime.",
  },
  {
    num: "04", icon: "📈",
    title: "Ongoing Strategy. Not a One-Time Sale.",
    body: "As your business grows, your payment setup should evolve. We check in regularly and adjust so you're never paying more than you should.",
  },
];

const services = [
  {
    title: "Statement Analysis",
    subtitle: "Intelligence first",
    body: "Monthly reviews that translate fees, rates, and changes into plain English — with a human analyst on every review.",
    tags: ["Monthly human review", "Fee identification", "Rate guidance"],
    accent: "from-emerald-50/60 to-teal-50/30",
    iconBg: "bg-emerald-600",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  },
  {
    title: "Payment Processing",
    subtitle: "The foundation",
    body: "Transparent processing for card, ACH, mobile, and online payments. Interchange-plus pricing. Next-day funding. No hidden rate creep.",
    tags: ["All card types", "Next-day funding", "Interchange-plus"],
    accent: "from-navy-50 to-accent-50/40",
    iconBg: "bg-accent-500",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
];

const supportingServices = [
  {
    title: "Mobile Payments",
    body: "Tap-to-pay, digital invoices, and field receipts — built for crews on-site, not just the office.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  },
  {
    title: "Recurring Billing",
    body: "Support for maintenance agreements, memberships, and recurring service plans. Set up once, collect reliably.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
  },
  {
    title: "Funding Visibility",
    body: "Clearer understanding of deposits, batches, funding timing, and daily payment activity.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  },
  {
    title: "Surcharging",
    body: "Compliance-aware surcharge program guidance designed to help offset processing costs while protecting the customer experience.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  },
];

// ── Statement Review Visual ────────────────────────────────────────────────────
const reviewFindings = [
  { label: "Markup above agreement",   amount: "$340", color: "#ef4444" },
  { label: "PCI & access fees",        amount: "$128", color: "#f97316" },
  { label: "Interchange downgrades",   amount: "$214", color: "#eab308" },
];

function StatementVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
      className="relative w-full max-w-[480px] mx-auto select-none"
    >
      {/* Floating badge — top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 1.1, ease: EASE }}
        className="absolute -top-3.5 -right-3 bg-white rounded-xl px-3 py-2 flex items-center gap-1.5 z-10"
        style={{ boxShadow: "0 4px 16px rgba(12,21,36,0.09), 0 0 0 1px rgba(12,21,36,0.05)" }}
      >
        <span className="relative flex w-2 h-2 shrink-0">
          <span className="live-ring absolute inline-flex w-full h-full rounded-full bg-emerald-400" />
          <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[10px] font-semibold text-slate-600 whitespace-nowrap">Review complete</span>
      </motion.div>

      {/* Main card */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow: [
            "0 0 0 1px rgba(12,21,36,0.06)",
            "0 4px 8px rgba(12,21,36,0.04)",
            "0 16px 48px rgba(12,21,36,0.10)",
            "0 32px 80px rgba(37,99,235,0.06)",
          ].join(", "),
        }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-[0.08em]">Statement Review</p>
            <p className="text-[13px] font-bold text-navy-900 mt-0.5">Apex Roofing LLC · May 2026</p>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
            Analysis Complete
          </span>
        </div>

        <div className="p-5 space-y-4">
          {/* Rate comparison */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Current Effective Rate", value: "3.22%", accent: false, sub: "What you paid" },
              { label: "Optimized Rate",          value: "2.41%", accent: true,  sub: "After review" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-3.5"
                style={{
                  background: item.accent ? "rgba(37,99,235,0.06)" : "rgba(248,250,252,1)",
                  border: item.accent ? "1px solid rgba(37,99,235,0.18)" : "1px solid rgba(226,232,240,1)",
                }}
              >
                <p className="text-[8.5px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                <p className={`text-[22px] font-bold tabular-nums leading-none ${item.accent ? "text-accent-600" : "text-slate-700"}`}>
                  {item.value}
                </p>
                <p className="text-[8.5px] text-slate-400 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Findings */}
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-2.5">Findings</p>
            <div className="space-y-2">
              {reviewFindings.map((f) => (
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

          {/* Savings callout */}
          <div
            className="rounded-xl p-4 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0.04) 100%)", border: "1px solid rgba(37,99,235,0.14)" }}
          >
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-accent-500 mb-1">Est. Monthly Savings</p>
              <p className="text-[22px] font-bold text-navy-900 tabular-nums leading-none">
                $560<span className="text-sm font-normal text-slate-400">/mo</span>
              </p>
              <p className="text-[9px] text-slate-400 mt-1">3 issues identified · 0.81% rate improvement</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent-50 border border-accent-100 flex items-center justify-center text-lg shrink-0">💡</div>
          </div>

          {/* Recent transactions */}
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Recent</p>
            <div className="space-y-1.5">
              {[
                { name: "FlowRight Plumbing",  type: "Invoice Paid",   amount: "+$3,840", icon: "🔧" },
                { name: "Summit HVAC",          type: "ACH — Job Pymt", amount: "+$2,100", icon: "❄️" },
                { name: "BrightLine Electric",  type: "Mobile Payment", amount: "+$1,450", icon: "⚡" },
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

      {/* Floating savings chip — bottom left */}
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
          <p className="text-[9.5px] text-slate-400 mt-0.5 whitespace-nowrap">3 hidden fees found · $560/mo est. savings</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Savings Calculator ────────────────────────────────────────────────────────
function SavingsCalculator() {
  const [volume, setVolume]   = useState(75000);
  const [rate, setRate]       = useState(3.0);
  const [showResult, setShowResult] = useState(false);

  const currentFees   = (volume * rate) / 100;
  // Improvement scales with rate: higher rates have more room to optimize
  // Capped at 0.80%, minimum optimized rate 1.75%
  const improvement   = parseFloat(Math.min(rate * 0.18, 0.80).toFixed(2));
  const estOptRate    = parseFloat(Math.max(rate - improvement, 1.75).toFixed(2));
  const estOptFees    = (volume * estOptRate) / 100;
  const estSavings    = currentFees - estOptFees;
  const estAnnual     = estSavings * 12;

  return (
    <section className="py-24 lg:py-28 bg-surface border-t border-slate-100">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-5">
              Savings estimate
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-tight tracking-tight">
              See what your current processing may be costing you.
            </h2>
            <p className="mt-4 text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
              Enter your monthly volume and current effective rate for an illustrative estimate.
              A real review is the only way to confirm actual savings opportunities.
            </p>
          </div>
        </ScrollReveal>

        <div
          className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
          style={{ boxShadow: "0 4px 24px rgba(12,21,36,0.06), 0 1px 4px rgba(12,21,36,0.04)" }}
        >
          <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            {/* Inputs */}
            <div className="p-8">
              <p className="text-sm font-semibold text-navy-900 mb-6">Your current setup</p>

              <div className="space-y-7">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Monthly Processing Volume</label>
                    <span className="text-sm font-bold text-navy-900 tabular-nums">${fmt(volume)}</span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={500000}
                    step={5000}
                    value={volume}
                    onChange={(e) => { setVolume(Number(e.target.value)); setShowResult(true); }}
                    className="w-full accent-accent-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-300 mt-1">
                    <span>$5k</span><span>$500k</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Effective Rate</label>
                    <span className="text-sm font-bold text-navy-900 tabular-nums">{rate.toFixed(2)}%</span>
                  </div>
                  <input
                    type="range"
                    min={1.5}
                    max={5.5}
                    step={0.05}
                    value={rate}
                    onChange={(e) => { setRate(Number(e.target.value)); setShowResult(true); }}
                    className="w-full accent-accent-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-300 mt-1">
                    <span>1.50%</span><span>5.50%</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowResult(true)}
                  className="w-full rounded-lg bg-navy-900 text-white text-sm font-semibold py-3 hover:bg-navy-800 transition-colors"
                >
                  Calculate Estimate
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="p-8 flex flex-col">
              <p className="text-sm font-semibold text-navy-900 mb-6">Illustrative estimate</p>

              <AnimatePresence mode="wait">
                {showResult ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="flex flex-col gap-4 flex-1"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Current Monthly Fees",    value: `$${fmt(currentFees)}`,  muted: true  },
                        { label: "Est. Optimized Fees",     value: `$${fmt(estOptFees)}`,   muted: false },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl p-3.5"
                          style={{
                            background: item.muted ? "rgba(248,250,252,1)" : "rgba(37,99,235,0.05)",
                            border: item.muted ? "1px solid rgba(226,232,240,1)" : "1px solid rgba(37,99,235,0.15)",
                          }}
                        >
                          <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                          <p className={`text-lg font-bold tabular-nums ${item.muted ? "text-slate-600" : "text-accent-600"}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div
                      className="rounded-xl p-4 flex items-center justify-between flex-1"
                      style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.07) 0%, rgba(37,99,235,0.03) 100%)", border: "1px solid rgba(37,99,235,0.12)" }}
                    >
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-accent-500 mb-1">Est. Monthly Savings</p>
                        <p className="text-3xl font-bold text-navy-900 tabular-nums leading-none">
                          ${fmt(estSavings)}<span className="text-sm font-normal text-slate-400">/mo</span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1.5">
                          ~${fmt(estAnnual)}/year · assuming ~{improvement.toFixed(2)}% rate improvement
                        </p>
                      </div>
                    </div>

                    <p className="text-[10.5px] text-slate-400 leading-relaxed border-t border-slate-100 pt-4">
                      Estimates are for illustration only. A real statement review is required to confirm actual savings opportunities. Results vary based on volume, card mix, processor, and current pricing.
                    </p>

                    <button
                      onClick={openModal}
                      className="w-full rounded-lg text-white text-sm font-semibold py-3 transition-colors"
                      style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)", boxShadow: "0 1px 4px rgba(37,99,235,0.3)" }}
                    >
                      Request My Free Statement Review →
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center flex-1 text-center text-slate-300 gap-3"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-10 h-10 opacity-50">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm text-slate-400">Adjust the sliders to see your estimate.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BCGPage() {
  return (
    <>
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100/80"
        style={{ boxShadow: "0 1px 20px rgba(12,21,36,0.05)" }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-[60px] items-center justify-between gap-6">
            <a href="/" className="shrink-0">
              {/* TODO: Replace logo-dark.svg with a higher-resolution or simplified horizontal web logo when available */}
              <Image src="/logo-dark.svg" alt="321 Swipe" width={128} height={51}
                style={{ height: "auto", maxHeight: "34px", width: "auto" }} priority />
            </a>
            <span className="hidden sm:block text-[12px] font-medium text-slate-400 flex-1">
              For Blue Collar Success Group Members
            </span>
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
                Request a Review
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-[90svh] flex items-center overflow-hidden bg-white">
          {/* Subtle background */}
          <div aria-hidden className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 55% at 30% 50%, rgba(37,99,235,0.04) 0%, transparent 65%)" }} />
          <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{ backgroundImage: "radial-gradient(circle, rgba(12,21,36,0.08) 1.2px, transparent 1.2px)", backgroundSize: "40px 40px" }} />

          <div className="relative w-full mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-24">
            <div className="grid lg:grid-cols-[1fr_1.15fr] items-center gap-12 lg:gap-8">

              {/* Left — copy */}
              <div className="flex flex-col items-start max-w-[520px]">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05, ease: EASE }}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50/90 px-3.5 py-1.5 text-xs font-semibold text-navy-700 mb-6 shadow-sm">
                    <span className="relative flex w-1.5 h-1.5">
                      <span className="live-ring absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-60" />
                      <span className="relative w-1.5 h-1.5 rounded-full bg-accent-500" />
                    </span>
                    For Blue Collar Success Group Members
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.12, ease: EASE }}
                  className="font-bold tracking-[-0.035em] leading-[1.04]"
                  style={{ fontSize: "clamp(2.4rem, 5.2vw, 4.2rem)" }}
                >
                  <span className="block text-navy-700/80 font-semibold">Payment intelligence</span>
                  <span className="block" style={{
                    background: "linear-gradient(125deg, #1a3ed4 0%, #2563eb 30%, #3b82f6 60%, #93c5fd 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text", filter: "drop-shadow(0 1px 24px rgba(37,99,235,0.2))",
                  }}>for Blue Collar</span>
                  <span className="block text-navy-900">Success Group members.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
                  className="mt-5 text-[1rem] text-slate-500 leading-[1.72] max-w-[430px]"
                >
                  321 Swipe helps home service contractors review their merchant statements,
                  uncover hidden fees, improve payment visibility, and make smarter decisions
                  about processing costs — with real people reviewing real numbers.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.36, ease: EASE }}
                  className="mt-7 flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
                >
                  <button
                    onClick={openModal}
                    className="inline-flex items-center justify-center gap-2 rounded-lg text-white font-semibold text-sm px-6 py-3.5 transition-colors"
                    style={{
                      background: "linear-gradient(135deg, #0c1524 0%, #132040 100%)",
                      boxShadow: "0 1px 4px rgba(12,21,36,0.28), 0 6px 20px rgba(12,21,36,0.14), inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                  >
                    Request a Free Statement Review
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-60">
                      <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={openChat}
                    className="inline-flex items-center justify-center gap-2 rounded-lg text-navy-900 font-medium text-sm px-6 py-3.5 border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    Talk to 321 Swipe
                  </button>
                </motion.div>

                {/* Trust line */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.48, ease: EASE }}
                  className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-accent-400 shrink-0">
                    <path fillRule="evenodd" d="M8 .5a7.5 7.5 0 100 15A7.5 7.5 0 008 .5zm3.25 4.94a.75.75 0 010 1.06L7.06 10.69a.75.75 0 01-1.06 0L4.75 9.44a.75.75 0 011.06-1.06l.72.72 3.66-3.66a.75.75 0 011.06 0z" clipRule="evenodd" />
                  </svg>
                  Vendor partner serving Blue Collar Success Group members.
                </motion.p>

                {/* Proof row */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.54, ease: EASE }}
                  className="mt-6 pt-5 border-t border-slate-100/90 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400"
                >
                  {proofItems.map((item, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="font-semibold text-slate-600">{item.strong}</span>
                      <span>{item.rest}</span>
                      {i < proofItems.length - 1 && <span className="w-px h-3 bg-slate-200 ml-4 hidden sm:block" />}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Right — statement review visual */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                className="flex justify-center lg:justify-end lg:-mr-6"
              >
                <StatementVisual />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Partner Context ── */}
        <section className="py-20 lg:py-24 bg-surface border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-5">
                  Built for contractors
                </span>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-tight tracking-tight">
                  Built for the same contractors Blue Collar Success Group helps grow.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.16}>
                <p className="mt-4 text-base text-slate-500 leading-relaxed">
                  Growth-focused contractors need more than payment processing. They need visibility into what
                  they are paying, how money is moving, and where avoidable costs are hiding. 321 Swipe brings
                  payment intelligence and human support to the back-office side of growth.
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
                  className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 transition-all cursor-default"
                >
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

        {/* ── Diagnostic Section ── */}
        <section className="py-20 lg:py-28 bg-white border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_1.6fr] gap-16 items-start">
              <div className="lg:sticky lg:top-28">
                <ScrollReveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                    Statement review
                  </span>
                </ScrollReveal>
                <ScrollReveal delay={0.08}>
                  <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-[1.1] tracking-tight">
                    What a 321 Swipe review actually looks for.
                  </h2>
                </ScrollReveal>
                <ScrollReveal delay={0.16}>
                  <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-sm">
                    Most contractors don&apos;t need another processor pitch. They need someone to translate
                    the statement, identify the leaks, and explain what should change.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.24}>
                  <button
                    onClick={openModal}
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-navy-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-navy-800 transition-colors"
                  >
                    Get your free review
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70">
                      <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </ScrollReveal>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {diagnostics.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: i * 0.08, duration: 0.45, ease: EASE }}
                    className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-slate-300 hover:bg-white hover:shadow-sm transition-all cursor-default"
                  >
                    <div className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-accent-500 mb-3.5 group-hover:border-accent-200 group-hover:bg-accent-50 transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-navy-900 mb-1.5">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Savings Calculator ── */}
        <SavingsCalculator />

        {/* ── Verian / Intelligence ── */}
        <section
          className="relative py-24 lg:py-32 overflow-hidden"
          style={{ background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 5%, #94a3b8 14%, #1e293b 26%, #0d1e3a 38%, #060d1c 52%)" }}
        >
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
                  Statement analysis that makes processing easier to understand.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.16}>
                <p className="mt-5 text-[15px] text-navy-100/70 leading-relaxed">
                  Verian is 321 Swipe&apos;s payment intelligence platform. It turns processor statements into
                  plain-English insights, clear fee visibility, and concrete savings opportunities.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.24}>
                <div className="mt-8 inline-flex flex-col items-start gap-3 rounded-2xl border border-navy-700/50 bg-navy-800/30 px-6 py-5 text-left">
                  {verianBullets.map((b) => (
                    <div key={b} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent-500/20 border border-accent-500/30 flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-2.5 h-2.5 text-accent-400">
                          <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-navy-100/80">{b}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.32}>
                <div className="mt-8">
                  <button
                    onClick={openModal}
                    className="inline-flex items-center gap-2 rounded-lg text-white text-sm font-semibold px-6 py-3 transition-opacity hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)", boxShadow: "0 1px 4px rgba(37,99,235,0.3)" }}
                  >
                    See What We&apos;d Find in Your Statement
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70">
                      <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                    </svg>
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
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                  Human partnership
                </span>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-[1.1] tracking-tight">
                  Software can process payments.{" "}
                  <span className="text-slate-400 font-normal">It can&apos;t understand your business.</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.16}>
                <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-2xl">
                  Every contractor we work with gets more than a payment processor. They get a named advisor
                  who picks up the phone, reviews their numbers, and brings savings opportunities before
                  they have to ask.
                </p>
              </ScrollReveal>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {advisorCards.map((card, i) => (
                <motion.div
                  key={card.num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                  className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100 transition-shadow cursor-default"
                >
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
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                  Services
                </span>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-tight tracking-tight">
                  Everything a home service contractor needs to manage payments smarter.
                </h2>
              </ScrollReveal>
            </div>

            {/* Featured 2-col */}
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              {services.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.12, duration: 0.5, ease: EASE }}
                  className={`group bg-gradient-to-br ${s.accent} rounded-2xl border border-slate-200 p-7 flex flex-col gap-5 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100/90 transition-shadow cursor-default`}
                >
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

            {/* Supporting 4-col */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {supportingServices.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.45, ease: EASE }}
                  className="group bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/80 transition-shadow cursor-default"
                >
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
        <section
          className="relative py-24 lg:py-36 overflow-hidden"
          style={{ background: "linear-gradient(180deg, #f8fafc 0%, #060d1c 6%)" }}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(37,99,235,0.15) 0%, transparent 55%)" }} />
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

          <div className="relative mx-auto max-w-3xl px-6 lg:px-8 text-center">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-navy-700 bg-navy-800/50 px-3.5 py-1.5 text-xs font-semibold text-navy-100 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
                Free for Blue Collar Success Group members
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                Blue Collar Success Group members: see what your processor statement is really telling you.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <p className="mt-6 text-base sm:text-lg text-navy-100/70 leading-relaxed max-w-2xl mx-auto">
                Send us a recent statement. We&apos;ll review it, explain what you&apos;re paying, identify
                potential savings opportunities, and show you where your payment setup can improve.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.24}>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={openModal}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-navy-900 font-semibold text-sm px-7 py-3.5 hover:bg-slate-50 transition-colors shadow-lg shadow-black/20"
                >
                  Request a Free Statement Review
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={openChat}
                  className="inline-flex items-center justify-center rounded-lg text-navy-100 font-medium text-sm px-7 py-3.5 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Talk to 321 Swipe
                </button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.32}>
              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
                {["No long-term contracts", "Free review", "Human-reviewed", "Built for contractors"].map((point) => (
                  <span key={point} className="flex items-center gap-1.5 text-xs text-navy-100/50">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-emerald-400 shrink-0">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
                    </svg>
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
                © {new Date().getFullYear()} 321 Swipe.{" "}
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
