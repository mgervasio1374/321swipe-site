"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";

const openModal = () => window.dispatchEvent(new Event("open-lead-modal"));
const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

export function SavingsCalculator() {
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
