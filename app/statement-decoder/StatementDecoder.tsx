"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/app/lib/animations";
import { track } from "@/app/lib/analytics";
import { FEES, GROUPS, SAMPLE as DEFAULT_SAMPLE, TOTALS, VERDICTS, feeBySlug, money, type Fee, type Verdict } from "@/app/lib/fees";

export interface DecoderProps {
  sample?: Partial<typeof DEFAULT_SAMPLE>;
  /** "a roofing company" — used in the intro sentence. */
  tradePhrase?: string;
  cta?: { label: string; href: string };
  /** Analytics label, e.g. "default" | "certainpath". */
  variant?: string;
}

// ── Small helpers ─────────────────────────────────────────────────────────────

/** Counts up to `to` whenever `active` flips true; snaps to `to` under reduced motion. */
function useCountUp(to: number, active: boolean, duration = 1800) {
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    if (reduce) { setVal(to); return; }
    let start: number | null = null;
    let raf = 0;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal((1 - Math.pow(1 - p, 3)) * to);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduce, to, duration]);
  return val;
}

function VerdictBadge({ verdict, size = "sm" }: { verdict: Verdict; size?: "sm" | "md" }) {
  const v = VERDICTS[verdict];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-[0.08em] ${
        size === "md" ? "px-2.5 py-1 text-[10.5px]" : "px-2 py-0.5 text-[9.5px]"
      }`}
      style={{ color: v.color, background: v.bg, boxShadow: `inset 0 0 0 1px ${v.ring}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: v.color }} />
      {v.label}
    </span>
  );
}

export function VerdictLegend({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex flex-wrap ${compact ? "gap-x-4 gap-y-1.5" : "gap-3"}`}>
      {(Object.keys(VERDICTS) as Verdict[]).map((k) => {
        const v = VERDICTS[k];
        return compact ? (
          <span key={k} className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-500">
            <span className="w-2 h-2 rounded-full" style={{ background: v.color }} />
            {v.label}
          </span>
        ) : (
          <div
            key={k}
            className="flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 bg-white"
            style={{ borderColor: v.ring }}
          >
            <span className="mt-1 w-2.5 h-2.5 rounded-full shrink-0" style={{ background: v.color }} />
            <div>
              <p className="text-[12.5px] font-semibold" style={{ color: v.color }}>{v.label}</p>
              <p className="text-[11.5px] text-slate-500 leading-snug">{v.blurb}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Explainer content (shared by desktop panel and mobile sheet) ──────────────

function Explainer({ fee, onPick }: { fee: Fee; onPick: (slug: string) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <VerdictBadge verdict={fee.verdict} size="md" />
        {fee.sampleAmount !== null && (
          <span className="text-[13px] font-semibold text-navy-900 tabular-nums">{money(fee.sampleAmount)}</span>
        )}
      </div>
      <h3 className="mt-3 text-[20px] font-bold text-navy-900 leading-tight tracking-tight">{fee.label}</h3>
      <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.06em] text-slate-400">
        On the statement: {fee.statementLabel}
      </p>
      <p className="mt-4 text-[14px] text-slate-600 leading-[1.7]">{fee.plainEnglish}</p>

      <div className="mt-5 grid gap-3">
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 px-4 py-3">
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-slate-400">What a fair version looks like</p>
          <p className="mt-1 text-[13px] text-navy-900 leading-relaxed">{fee.typicalRange}</p>
        </div>
        <div className="rounded-xl bg-navy-50 border border-navy-100 px-4 py-3">
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-navy-700/70">What 321 Swipe would do</p>
          <p className="mt-1 text-[13px] text-navy-900 leading-relaxed">{fee.whatWeDo}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Link
          href={`/fees/${fee.slug}`}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-600 hover:text-accent-500 transition-colors"
        >
          Read the full entry
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70">
            <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      {fee.related.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-slate-400">Related lines</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {fee.related.map((slug) => {
              const r = feeBySlug(slug);
              if (!r) return null;
              return (
                <button
                  key={slug}
                  onClick={() => onPick(slug)}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11.5px] text-slate-600 hover:border-navy-900 hover:text-navy-900 transition-colors"
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ExplainerEmpty({ SAMPLE, tradePhrase }: { SAMPLE: typeof DEFAULT_SAMPLE; tradePhrase: string }) {
  return (
    <div>
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-slate-400">How to use this</p>
      <h3 className="mt-2 text-[20px] font-bold text-navy-900 leading-tight tracking-tight">
        Hover any line on the statement.
      </h3>
      <p className="mt-3 text-[14px] text-slate-600 leading-[1.7]">
        This is a realistic statement for {tradePhrase} doing about{" "}
        {money(SAMPLE.volume).replace(".00", "")}{" "}
        a month on a tiered plan. Every line is real, in the sense that contractors receive one just like it.
        Point at a line and we&apos;ll tell you what it is, what a fair version looks like, and what we&apos;d do about it.
      </p>
      <div className="mt-5">
        <VerdictLegend />
      </div>
      <p className="mt-5 text-[12.5px] text-slate-400 leading-relaxed">
        Or flip <b className="text-slate-600">Show what 321 Swipe would flag</b> to see every questionable line at once.
      </p>
    </div>
  );
}

// ── Statement row ─────────────────────────────────────────────────────────────

interface RowProps {
  fee: Fee;
  index: number;
  active: boolean;
  flagOn: boolean;
  onHover: (slug: string) => void;
  onSelect: (slug: string) => void;
}

function StatementRow({ fee, index, active, flagOn, onHover, onSelect }: RowProps) {
  const v = VERDICTS[fee.verdict];
  const flagged = flagOn && fee.verdict !== "pass-through" && fee.sampleAmount !== 0;
  const isNote = fee.sampleAmount === null;

  return (
    <motion.button
      type="button"
      onMouseEnter={() => onHover(fee.slug)}
      onFocus={() => onHover(fee.slug)}
      onClick={() => onSelect(fee.slug)}
      aria-pressed={active}
      animate={{
        backgroundColor: flagged ? v.bg : active ? "#f8fafc" : "rgba(255,255,255,0)",
        boxShadow: active
          ? "inset 3px 0 0 #0c1524"
          : flagged
            ? `inset 3px 0 0 ${v.color}`
            : "inset 3px 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.35, delay: flagOn ? 0.15 + index * 0.06 : 0, ease: EASE }}
      className={`group w-full text-left flex items-baseline gap-3 px-4 sm:px-5 py-2 sm:py-[7px] rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
        isNote ? "items-start" : ""
      }`}
    >
      <span
        aria-hidden
        className="relative top-[-1px] w-1.5 h-1.5 rounded-full shrink-0 self-center transition-opacity"
        style={{ background: v.color, opacity: flagged || active ? 1 : 0 }}
      />
      <span className={`flex-1 min-w-0 ${isNote ? "" : "flex items-baseline gap-x-3 flex-wrap"}`}>
        <span
          className={`text-[12.5px] sm:text-[13px] tracking-[0.02em] ${
            active ? "text-navy-900 font-semibold" : "text-slate-700 group-hover:text-navy-900"
          } ${isNote ? "font-mono uppercase text-[11.5px] sm:text-[12px] leading-relaxed" : "font-mono uppercase"}`}
        >
          {fee.statementLabel}
        </span>
        {fee.sampleDetail && (
          <span className="text-[11px] text-slate-400 font-mono">{fee.sampleDetail}</span>
        )}
      </span>
      {!isNote && (
        <span
          className={`shrink-0 text-[13px] font-mono tabular-nums ${
            flagged ? "font-semibold" : active ? "text-navy-900 font-semibold" : "text-slate-700"
          }`}
          style={flagged ? { color: v.color } : undefined}
        >
          {money(fee.sampleAmount!)}
        </span>
      )}
    </motion.button>
  );
}

// ── The decoder ───────────────────────────────────────────────────────────────

export function StatementDecoder({ sample, tradePhrase = "a roofing company", cta = { label: "Decode my statement", href: "https://upload.321swipe.com" }, variant = "default" }: DecoderProps = {}) {
  const SAMPLE = { ...DEFAULT_SAMPLE, ...sample };
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [flagOn, setFlagOn] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const reduce = useReducedMotion();
  const statementRef = useRef<HTMLDivElement>(null);

  const shownSlug = activeSlug ?? pinned;
  const shown = shownSlug ? feeBySlug(shownSlug) ?? null : null;

  const flaggedTotal = useCountUp(TOTALS.flagged, flagOn);
  const avoidableTotal = useCountUp(TOTALS.avoidable, flagOn, 2200);

  const seen = useRef<Set<string>>(new Set());
  const onHover = useCallback((slug: string) => {
    setActiveSlug(slug);
    if (!seen.current.has(slug)) {
      seen.current.add(slug);
      const f = feeBySlug(slug);
      if (f) track({ name: "decoder_line", fee: slug, verdict: f.verdict, variant, via: "hover" });
    }
  }, [variant]);
  const onSelect = useCallback((slug: string) => {
    setPinned(slug);
    setActiveSlug(slug);
    setSheetOpen(true);
    if (!seen.current.has(slug)) {
      seen.current.add(slug);
      const f = feeBySlug(slug);
      if (f) track({ name: "decoder_line", fee: slug, verdict: f.verdict, variant, via: "tap" });
    }
  }, [variant]);
  const onLeaveStatement = useCallback(() => setActiveSlug(null), []);

  const toggleFlags = () => {
    setFlagOn((v) => {
      if (!v) setScanKey((k) => k + 1);
      track({ name: "decoder_flag_toggle", on: !v, variant });
      return !v;
    });
  };

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [sheetOpen]);

  // Esc closes the sheet.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSheetOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rowsByGroup = useMemo(
    () => GROUPS.map((g) => ({ ...g, fees: FEES.filter((f) => f.group === g.id) })),
    [],
  );
  // Global row index for the staggered flag reveal.
  const indexOf = useMemo(() => new Map(FEES.map((f, i) => [f.slug, i])), []);

  const pickRelated = (slug: string) => {
    setPinned(slug);
    setActiveSlug(slug);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* ── Controls row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="lg:hidden">
          <VerdictLegend compact />
        </div>
        <div className="hidden lg:block text-[12.5px] text-slate-400">
          Sample statement · {SAMPLE.business} · {SAMPLE.period}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={flagOn}
          onClick={toggleFlags}
          className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white pl-1.5 pr-4 py-1.5 text-[13px] font-medium text-navy-900 shadow-sm hover:border-slate-300 transition-colors self-start sm:self-auto"
        >
          <span
            className="relative w-10 h-6 rounded-full transition-colors"
            style={{ background: flagOn ? "#2563eb" : "#cbd5e1" }}
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
              style={{ left: flagOn ? 18 : 2 }}
            />
          </span>
          Show what 321 Swipe would flag
        </button>
      </div>

      <div className="grid lg:grid-cols-[1.12fr_0.88fr] gap-6 lg:gap-8 items-start">
        {/* ── Statement ── */}
        <div
          ref={statementRef}
          onMouseLeave={onLeaveStatement}
          className="relative rounded-[18px] bg-white border border-slate-200/90 overflow-hidden"
          style={{ boxShadow: "0 24px 60px rgba(12,21,36,0.10), 0 2px 6px rgba(12,21,36,0.05)" }}
        >
          {/* Scan line — one sweep each time flags are switched on */}
          <AnimatePresence>
            {flagOn && !reduce && (
              <motion.div
                key={scanKey}
                aria-hidden
                initial={{ top: "0%", opacity: 0 }}
                animate={{ top: ["0%", "4%", "96%", "100%"], opacity: [0, 1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.9, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
                style={{
                  background: "linear-gradient(90deg, transparent, #60a5fa, transparent)",
                  boxShadow: "0 0 18px rgba(96,165,250,0.8)",
                }}
              />
            )}
          </AnimatePresence>

          {/* Statement header — the "paper" */}
          <div className="px-5 sm:px-7 pt-6 pb-5 border-b border-dashed border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-slate-400">Merchant statement</p>
                <p className="mt-1 text-[15px] font-bold text-navy-900 tracking-tight">{SAMPLE.business}</p>
                <p className="text-[11.5px] text-slate-500">{SAMPLE.address}</p>
              </div>
              <div className="font-mono text-[11px] text-slate-500 sm:text-right leading-[1.7]">
                <p>MID {SAMPLE.merchantId}</p>
                <p>Activity {SAMPLE.period}</p>
                <p>Issued {SAMPLE.statementDate}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4">
              {[
                { k: "Sales volume", v: money(SAMPLE.volume), s: `${SAMPLE.salesCount} items` },
                { k: "Refunds", v: `(${money(SAMPLE.refunds)})`, s: `${SAMPLE.refundCount} items` },
                { k: "Total fees", v: money(TOTALS.total), s: "deducted" },
                { k: "Effective rate", v: `${(TOTALS.effectiveRate * 100).toFixed(2)}%`, s: "of volume" },
              ].map((c) => (
                <div key={c.k}>
                  <p className="text-[9.5px] font-mono uppercase tracking-[0.1em] text-slate-400">{c.k}</p>
                  <p className="mt-0.5 text-[15px] font-semibold text-navy-900 tabular-nums font-mono">{c.v}</p>
                  <p className="text-[10.5px] text-slate-400">{c.s}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-mono text-slate-500">
              {SAMPLE.cards.map((c) => (
                <span key={c.brand}>
                  <span className="text-slate-400">{c.brand}</span> {money(c.amount)} · {c.count}
                </span>
              ))}
            </div>
          </div>

          {/* Groups */}
          <div className="py-3">
            {rowsByGroup.map((g) => {
              const subtotal = g.fees.reduce((a, f) => a + (f.sampleAmount ?? 0), 0);
              const isContract = g.id === "contract";
              return (
                <section key={g.id} className="px-1 sm:px-2 py-2.5">
                  <div className="px-4 sm:px-5 pb-1.5 flex items-baseline justify-between gap-3">
                    <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-navy-900 whitespace-nowrap">{g.title}</h3>
                    <span className="hidden xl:block text-[10.5px] text-slate-400 truncate">{g.blurb}</span>
                  </div>
                  <div className="flex flex-col">
                    {g.fees.map((f) => (
                      <StatementRow
                        key={f.slug}
                        fee={f}
                        index={indexOf.get(f.slug) ?? 0}
                        active={shownSlug === f.slug}
                        flagOn={flagOn}
                        onHover={onHover}
                        onSelect={onSelect}
                      />
                    ))}
                  </div>
                  {!isContract && (
                    <div className="mx-4 sm:mx-5 mt-1.5 pt-1.5 border-t border-slate-100 flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400 uppercase tracking-[0.08em]">Subtotal</span>
                      <span className="text-slate-600 tabular-nums">{money(subtotal)}</span>
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          {/* Total */}
          <div className="px-5 sm:px-7 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-navy-900 font-semibold">Total fees this period</span>
            <span className="text-[16px] font-mono font-bold text-navy-900 tabular-nums">{money(TOTALS.total)}</span>
          </div>

          {/* Flag summary — slides in under the statement */}
          <AnimatePresence>
            {flagOn && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="px-5 sm:px-7 py-5 bg-navy-900 text-white">
                  <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-center">
                    <div>
                      <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-blue-300">What we&apos;d flag on this statement</p>
                      <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-1">
                        <span>
                          <span className="text-[26px] font-bold tabular-nums tracking-tight">{money(flaggedTotal)}</span>
                          <span className="ml-2 text-[12px] text-blue-100/70">negotiable or avoidable</span>
                        </span>
                        <span>
                          <span className="text-[18px] font-semibold tabular-nums" style={{ color: "#fca5a5" }}>{money(avoidableTotal)}</span>
                          <span className="ml-2 text-[12px] text-blue-100/70">pure junk · ≈ {money(Math.round(TOTALS.annualAvoidable)).replace(".00", "")} a year</span>
                        </span>
                      </div>
                      <p className="mt-2 text-[12.5px] text-blue-100/80 leading-relaxed max-w-xl">
                        Plus a 36-month auto-renewing contract, a $495 exit fee and a terminal lease billed somewhere else entirely.
                        None of that shows in a monthly total.
                      </p>
                    </div>
                    <a
                      href={cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track({ name: "decoder_cta", variant })}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-navy-900 font-semibold text-[13px] px-5 py-3 hover:bg-slate-50 transition-colors shadow-lg shadow-black/30 whitespace-nowrap"
                    >
                      {cta.label}
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Desktop explainer panel ── */}
        <aside
          aria-live="polite"
          className="hidden lg:block lg:sticky lg:top-24 rounded-[18px] bg-white border border-slate-200/90 p-6"
          style={{ boxShadow: "0 16px 48px rgba(12,21,36,0.08), 0 0 0 1px rgba(12,21,36,0.02)" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={shown?.slug ?? "empty"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              {shown ? <Explainer fee={shown} onPick={pickRelated} /> : <ExplainerEmpty SAMPLE={SAMPLE} tradePhrase={tradePhrase} />}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>

      {/* ── Mobile bottom sheet ── */}
      <AnimatePresence>
        {sheetOpen && shown && (
          <div className="lg:hidden fixed inset-0 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSheetOpen(false)}
              className="absolute inset-0 bg-navy-950/55 backdrop-blur-[2px]"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={shown.label}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="absolute inset-x-0 bottom-0 max-h-[86svh] overflow-y-auto rounded-t-[22px] bg-white px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
              style={{ boxShadow: "0 -20px 60px rgba(12,21,36,0.25)" }}
            >
              <div className="sticky top-0 bg-white pt-1 pb-3 flex items-center justify-between">
                <span className="mx-auto absolute left-1/2 -translate-x-1/2 top-2 w-10 h-1 rounded-full bg-slate-200" />
                <span />
                <button
                  onClick={() => setSheetOpen(false)}
                  aria-label="Close"
                  className="mt-3 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-3.5 h-3.5">
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              </div>
              <Explainer fee={shown} onPick={pickRelated} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
