"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/app/lib/animations";
import { track } from "@/app/lib/analytics";
import { QUESTIONS, score, gradeFor, encode, decode, type Answers } from "@/app/lib/grader";
import { feeBySlug } from "@/app/lib/fees";

const SITE = "https://321swipe.com";

function RateCalculator({ onBand }: { onBand: (idx: number) => void }) {
  const [fees, setFees] = useState("");
  const [vol, setVol] = useState("");
  const f = parseFloat(fees.replace(/[^0-9.]/g, ""));
  const v = parseFloat(vol.replace(/[^0-9.]/g, ""));
  const rate = f > 0 && v > 0 ? (f / v) * 100 : null;
  useEffect(() => {
    if (rate === null) return;
    onBand(rate < 2.3 ? 0 : rate < 2.8 ? 1 : rate < 3.3 ? 2 : 3);
  }, [rate, onBand]);
  const input = "w-full min-w-0 rounded-lg bg-white border border-slate-200 px-3 py-2 text-[14px] text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 tabular-nums";
  return (
    <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">Quick calculator (optional)</p>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_auto] items-center gap-2">
        <input inputMode="decimal" placeholder="Total fees $" value={fees} onChange={(e) => setFees(e.target.value)} className={input} aria-label="Total fees last month" />
        <span className="text-slate-400">÷</span>
        <input inputMode="decimal" placeholder="Card sales $" value={vol} onChange={(e) => setVol(e.target.value)} className={input} aria-label="Total card sales last month" />
        <span className="text-slate-400">=</span>
        <span className="text-[15px] font-bold tabular-nums text-navy-900 min-w-[3.5rem] text-right">{rate === null ? "—" : `${rate.toFixed(2)}%`}</span>
      </div>
    </div>
  );
}

export function Grader() {
  const reduce = useReducedMotion();
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  // Restore a shared result from the URL.
  useEffect(() => {
    try {
      const a = decode(new URLSearchParams(window.location.search).get("a"));
      if (a) { setAnswers(a); setDone(true); }
    } catch {}
  }, []);

  const q = QUESTIONS[step];
  const selected = answers[q.id] ?? [];
  const canAdvance = selected.length > 0;

  const choose = (idx: number) => {
    setAnswers((prev) => {
      if (!q.multi) return { ...prev, [q.id]: [idx] };
      const noneIdx = q.options.findIndex((o) => o.points === 0 && o.finding?.good);
      const cur = prev[q.id] ?? [];
      if (idx === noneIdx) return { ...prev, [q.id]: [noneIdx] };
      const next = cur.includes(idx) ? cur.filter((i) => i !== idx) : [...cur.filter((i) => i !== noneIdx), idx];
      return { ...prev, [q.id]: next };
    });
  };

  const next = () => {
    if (step === 0) track({ name: "grader_start" });
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else {
      setDone(true);
      const r = score(answers);
      track({ name: "grader_complete", grade: gradeFor(r.total).letter, score: r.total });
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("a", encode(answers));
        window.history.replaceState(null, "", url.toString());
      } catch {}
    }
  };

  const reset = () => {
    setAnswers({}); setStep(0); setDone(false); setCopied(false);
    try { window.history.replaceState(null, "", window.location.pathname); } catch {}
  };

  const result = useMemo(() => (done ? score(answers) : null), [done, answers]);
  const grade = result ? gradeFor(result.total) : null;
  const shareUrl = `${SITE}/grade-my-statement?a=${encode(answers)}`;

  const copy = async () => {
    if (grade) track({ name: "grader_share", grade: grade.letter });
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const card = "rounded-[20px] bg-white border border-slate-200/90";
  const shadow = { boxShadow: "0 24px 60px rgba(12,21,36,0.10), 0 2px 6px rgba(12,21,36,0.05)" };

  if (done && result && grade) {
    const bad = result.findings.filter((f) => !f.good);
    const good = result.findings.filter((f) => f.good);
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className={`${card} overflow-hidden`} style={shadow}>
        <div className="grid md:grid-cols-[220px_1fr]">
          <div className="flex flex-col items-center justify-center md:justify-start gap-2 p-8 md:p-10 md:pt-14 border-b md:border-b-0 md:border-r border-slate-100" style={{ background: grade.bg }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: grade.color }}>Your statement grade</p>
            <motion.span
              initial={reduce ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
              className="font-bold leading-none tracking-tight"
              style={{ fontSize: "7rem", color: grade.color }}
            >
              {grade.letter}
            </motion.span>
            <p className="text-[12px] text-slate-500 tabular-nums">{result.total} / 100</p>
          </div>
          <div className="p-6 sm:p-8">
            <h3 className="text-[22px] font-bold text-navy-900 tracking-tight leading-tight">{grade.headline}</h3>
            <p className="mt-2 text-[14.5px] text-slate-600 leading-relaxed">{grade.body}</p>

            {bad.length > 0 && (
              <div className="mt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">What&apos;s dragging the grade</p>
                <ul className="mt-2.5 flex flex-col gap-2.5">
                  {bad.map((f, i) => (
                    <li key={i} className="flex gap-3 text-[13.5px] text-slate-600 leading-relaxed">
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      <span>
                        {f.text}{" "}
                        {f.fee && feeBySlug(f.fee) && (
                          <Link href={`/fees/${f.fee}`} className="font-semibold text-accent-600 hover:text-accent-500 whitespace-nowrap">
                            {feeBySlug(f.fee)!.label} →
                          </Link>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {good.length > 0 && (
              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">What&apos;s working</p>
                <ul className="mt-2.5 flex flex-col gap-2.5">
                  {good.map((f, i) => (
                    <li key={i} className="flex gap-3 text-[13.5px] text-slate-600 leading-relaxed">
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href="https://upload.321swipe.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track({ name: "grader_cta", grade: grade.letter })}
                className="inline-flex items-center justify-center gap-2 rounded-lg text-white font-semibold text-sm px-6 py-3"
                style={{ background: "linear-gradient(135deg, #0c1524 0%, #132040 100%)", boxShadow: "0 1px 4px rgba(12,21,36,0.28), 0 6px 20px rgba(12,21,36,0.14)" }}
              >
                Get the real grade — free review
              </a>
              <button onClick={copy} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-navy-900 px-5 py-3 text-sm font-medium border border-slate-200 hover:border-slate-300 transition-colors">
                {copied ? "Link copied" : "Copy a link to this result"}
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px]">
              <Link href="/statement-decoder" className="font-semibold text-accent-600 hover:text-accent-500">See a statement decoded →</Link>
              <button onClick={reset} className="text-slate-400 hover:text-navy-900">Start over</button>
            </div>
            <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
              This grade is based on your answers, not your statement. It&apos;s a starting point, not a quote — the real number comes from the review.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`${card} overflow-hidden`} style={shadow}>
      {/* progress */}
      <div className="px-6 sm:px-8 pt-6 flex items-center justify-between gap-4">
        <div className="flex gap-1.5">
          {QUESTIONS.map((_, i) => (
            <span key={i} className="h-1.5 rounded-full transition-all" style={{ width: i === step ? 28 : 10, background: i <= step ? "#2563eb" : "#e2e8f0" }} />
          ))}
        </div>
        <span className="text-[11.5px] text-slate-400 tabular-nums">{step + 1} of {QUESTIONS.length}</span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="px-6 sm:px-8 pt-5 pb-7"
        >
          <h3 className="text-[21px] sm:text-[24px] font-bold text-navy-900 tracking-tight leading-tight">{q.title}</h3>
          {q.help && <p className="mt-2 text-[13.5px] text-slate-500 leading-relaxed max-w-xl">{q.help}</p>}

          <div className="mt-5 grid gap-2">
            {q.options.map((o, i) => {
              const on = selected.includes(i);
              return (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => choose(i)}
                  aria-pressed={on}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-[14.5px] transition-colors ${
                    on ? "border-accent-500 bg-accent-50/60 text-navy-900" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`shrink-0 w-4.5 h-4.5 w-[18px] h-[18px] ${q.multi ? "rounded-[5px]" : "rounded-full"} border flex items-center justify-center ${
                      on ? "border-accent-500 bg-accent-500" : "border-slate-300 bg-white"
                    }`}
                  >
                    {on && (
                      <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
                        <path d="M2.5 6.5l2.5 2.5 4.5-5" />
                      </svg>
                    )}
                  </span>
                  {o.label}
                </button>
              );
            })}
          </div>

          {q.id === "rate" && <RateCalculator onBand={(b) => setAnswers((p) => ({ ...p, rate: [b] }))} />}

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="text-[13px] font-medium text-slate-400 hover:text-navy-900 disabled:opacity-0"
            >
              ← Back
            </button>
            <motion.button
              type="button"
              onClick={next}
              disabled={!canAdvance}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-lg text-white font-semibold text-sm px-6 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #0c1524 0%, #132040 100%)", boxShadow: "0 1px 4px rgba(12,21,36,0.28), 0 6px 20px rgba(12,21,36,0.14)" }}
            >
              {step === QUESTIONS.length - 1 ? "Show my grade" : "Next"}
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-60">
                <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
