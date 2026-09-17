"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";

const openModal = () => window.dispatchEvent(new Event("open-lead-modal"));
const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

// ── Workflow Review Module ─────────────────────────────────────────────────────
const PAYMENT_TYPES = ["Card Present", "Mobile / Tap-to-pay", "Digital Invoice", "ACH / Bank Transfer", "Recurring Billing"];
const DEPOSIT_OPTS  = ["Clear — I know exactly what's coming", "Somewhat clear — I check but still have questions", "Unclear — I often don't know until it hits"];

export function WorkflowReview() {
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
    <section id="workflow-review" className="py-24 lg:py-28 bg-surface border-t border-slate-100">
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
              Walk through your current setup in three steps. We&apos;ll highlight where the biggest opportunities are.
            </p>
          </div>
        </ScrollReveal>

        {/* Step indicator */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
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
