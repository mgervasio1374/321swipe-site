"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/app/lib/animations";
import { track } from "@/app/lib/analytics";
import {
  type Application,
  type Errors,
  type DocumentKey,
  STEPS,
  BUSINESS_TYPES,
  LLC_TAX_CLASSES,
  SITE_TYPES,
  ID_TYPES,
  US_STATES,
  DOCUMENT_SLOTS,
  MAX_TOTAL_BYTES,
  emptyApplication,
  emptyPrincipal,
  validateStep,
  redactForDraft,
  fmtPhone,
  fmtSsn,
  fmtEin,
  digits,
  maskSsn,
  maskAccount,
  maskEin,
} from "@/app/lib/application/schema";
import { prepareFile, fmtBytes, type Prepared } from "./files";
import { Checkbox, Choice, SecretInput, SectionTitle, Select, SubTitle, TextInput, Textarea } from "./fields";

const DRAFT_KEY = "321swipe-apply-draft-v1";
const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

type Status = "idle" | "submitting" | "done";
type Docs = Record<DocumentKey, Prepared[]>;
const emptyDocs = (): Docs => ({ voidedCheck: [], ownerId: [], statements: [], other: [] });

// ── Immutable path update ──────────────────────────────────────────────────
function setPath(obj: unknown, keys: string[], value: unknown): unknown {
  if (keys.length === 0) return value;
  const [k, ...rest] = keys;
  if (Array.isArray(obj)) {
    const arr = [...obj];
    arr[Number(k)] = setPath(arr[Number(k)], rest, value);
    return arr;
  }
  const o = { ...((obj ?? {}) as Record<string, unknown>) };
  o[k] = setPath(o[k], rest, value);
  return o;
}

const onlyDigits = (max: number) => (v: string) => digits(v).slice(0, max);
const currency = (v: string) => {
  const d = v.replace(/[^0-9.]/g, "");
  const [int, dec] = d.split(".");
  const n = int ? Number(int).toLocaleString("en-US") : "";
  return dec !== undefined ? `${n}.${dec.slice(0, 2)}` : n;
};
const pct = (v: string) => digits(v).slice(0, 3);

// ── Component ──────────────────────────────────────────────────────────────

export function ApplyForm() {
  const [app, setApp] = useState<Application>(emptyApplication);
  const [docs, setDocs] = useState<Docs>(emptyDocs);
  const [docError, setDocError] = useState<string | null>(null);
  const [busyDocs, setBusyDocs] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileEl = useRef<HTMLDivElement>(null);
  const turnstileId = useRef<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const step = STEPS[stepIdx].key;

  // Start clock + restore draft (non-sensitive fields only) on mount.
  useEffect(() => {
    // Deferred so it runs after hydration (sessionStorage is browser-only).
    const t = setTimeout(() => {
      let restored: Application | null = null;
      try {
        const raw = sessionStorage.getItem(DRAFT_KEY);
        if (raw) restored = JSON.parse(raw) as Application;
      } catch {}
      setApp((prev) => ({ ...(restored ?? prev), startedAt: Date.now() }));
      if (restored) setDraftRestored(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Persist a redacted draft in this tab only.
  useEffect(() => {
    if (status === "done") return;
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(redactForDraft(app)));
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [app, status]);

  // Turnstile widget on the review step.
  useEffect(() => {
    if (!TURNSTILE_KEY || step !== "review") return;
    let cancelled = false;
    const mount = () => {
      if (cancelled || !turnstileEl.current || !window.turnstile || turnstileId.current) return;
      turnstileId.current = window.turnstile.render(turnstileEl.current, {
        sitekey: TURNSTILE_KEY,
        theme: "light",
        callback: (token: string) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    };
    if (window.turnstile) mount();
    else {
      const existing = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
      const s = existing ?? document.createElement("script");
      if (!existing) {
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true;
        s.dataset.turnstile = "1";
        document.head.appendChild(s);
      }
      s.addEventListener("load", mount);
    }
    return () => {
      cancelled = true;
      if (turnstileId.current && window.turnstile) {
        try { window.turnstile.remove(turnstileId.current); } catch {}
      }
      turnstileId.current = null;
    };
  }, [step]);

  const update = useCallback((path: string, value: unknown) => {
    setApp((prev) => setPath(prev, path.split("."), value) as Application);
    setErrors((prev) => {
      if (!prev[path]) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
  }, []);

  const err = (path: string) => errors[path];

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const focusFirstError = () => {
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>("[data-error='true']");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.querySelector<HTMLElement>("input,select,textarea,button")?.focus({ preventScroll: true });
    });
  };

  const goTo = (i: number) => {
    setStepIdx(i);
    setVisited((v) => new Set(v).add(i));
    scrollToTop();
  };

  const next = () => {
    const e = validateStep(app, step);
    if (Object.keys(e).length) {
      setErrors((prev) => ({ ...prev, ...e }));
      focusFirstError();
      return;
    }
    track({ name: "apply_step", step });
    goTo(Math.min(stepIdx + 1, STEPS.length - 1));
  };

  const totalBytes = useMemo(() => Object.values(docs).flat().reduce((a, p) => a + p.file.size, 0), [docs]);

  const addFiles = async (key: DocumentKey, list: FileList | null, multiple: boolean) => {
    if (!list || list.length === 0) return;
    setDocError(null);
    setBusyDocs(true);
    try {
      const prepared: Prepared[] = [];
      for (const f of Array.from(list).slice(0, multiple ? 5 : 1)) prepared.push(await prepareFile(f));
      setDocs((prev) => {
        const nextList = multiple ? [...prev[key], ...prepared].slice(0, 5) : prepared;
        const total = Object.entries({ ...prev, [key]: nextList }).flatMap(([, v]) => v).reduce((a, p) => a + p.file.size, 0);
        if (total > MAX_TOTAL_BYTES) {
          setDocError("That puts your attachments over 4 MB in total. Remove one, or skip it and we'll send you a secure upload link after we receive the application.");
          return prev;
        }
        return { ...prev, [key]: nextList };
      });
    } catch (e) {
      setDocError(e instanceof Error ? e.message : "Couldn't add that file.");
    } finally {
      setBusyDocs(false);
    }
  };
  const removeFile = (key: DocumentKey, i: number) => setDocs((prev) => ({ ...prev, [key]: prev[key].filter((_, j) => j !== i) }));

  const submit = async () => {
    const e = validateStep(app, "review");
    if (Object.keys(e).length) {
      setErrors((prev) => ({ ...prev, ...e }));
      focusFirstError();
      return;
    }
    if (TURNSTILE_KEY && !turnstileToken) {
      setSubmitError("Please complete the security check above.");
      return;
    }
    setStatus("submitting");
    setSubmitError(null);
    const fd = new FormData();
    fd.set("payload", JSON.stringify(app));
    fd.set("turnstile", turnstileToken);
    fd.set("website_url", ""); // honeypot
    for (const slot of DOCUMENT_SLOTS) for (const p of docs[slot.key]) fd.append(`doc_${slot.key}`, p.file, p.file.name);
    try {
      const res = await fetch("/api/apply", { method: "POST", body: fd, headers: { Accept: "application/json" } });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; reference?: string; message?: string; errors?: Errors };
      if (res.ok && data.ok) {
        track({ name: "apply_submit", files: Object.values(docs).flat().length });
        try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
        setReference(data.reference ?? null);
        setStatus("done");
        scrollToTop();
        return;
      }
      if (data.errors) {
        setErrors(data.errors);
        const firstKey = Object.keys(data.errors)[0] ?? "";
        const target = STEPS.findIndex((s) => firstKey.startsWith(s.key === "owners" ? "principals" : s.key));
        if (target >= 0) goTo(target);
        focusFirstError();
      }
      setSubmitError(data.message ?? "Something went wrong. Please try again.");
    } catch {
      setSubmitError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setStatus((s) => (s === "done" ? s : "idle"));
      if (window.turnstile && turnstileId.current) {
        try { window.turnstile.reset(turnstileId.current); } catch {}
        setTurnstileToken("");
      }
    }
  };

  // ── Success ────────────────────────────────────────────────────────────
  if (status === "done") {
    return (
      <div ref={topRef} className="scroll-mt-28 rounded-[20px] bg-white border border-slate-200/90 p-8 sm:p-12 text-center" style={{ boxShadow: "0 24px 60px rgba(12,21,36,0.10), 0 2px 6px rgba(12,21,36,0.05)" }}>
        <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="mt-5 text-[26px] font-bold text-navy-900 tracking-tight">Application received.</h2>
        <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-md mx-auto">
          Thanks, {app.company.contactName.split(" ")[0]}. We&apos;ve sent a confirmation to <b className="text-navy-900">{app.company.contactEmail}</b> and someone from 321 Swipe will be in touch within one business day.
        </p>
        {reference && (
          <p className="mt-6 inline-block rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-[13px] text-slate-600">
            Reference <span className="font-mono font-semibold text-navy-900">{reference}</span>
          </p>
        )}
        <p className="mt-6 text-[12.5px] text-slate-400 max-w-sm mx-auto">
          For your security, nothing you entered is kept on this website. If you need to change something, reply to the confirmation email.
        </p>
      </div>
    );
  }

  const c = app.company;
  const b = app.business;
  const k = app.bank;

  return (
    <div ref={topRef} className="scroll-mt-28">
      {/* Progress */}
      <ol className="mb-5 grid grid-cols-6 gap-1.5" aria-label="Application steps">
        {STEPS.map((s, i) => {
          const done = i < stepIdx;
          const current = i === stepIdx;
          const canJump = visited.has(i) && i < stepIdx;
          return (
            <li key={s.key} className="min-w-0">
              <button
                type="button"
                disabled={!canJump}
                onClick={() => goTo(i)}
                aria-current={current ? "step" : undefined}
                className={`block w-full text-left group ${canJump ? "cursor-pointer" : "cursor-default"}`}
              >
                <span className={`block h-1.5 rounded-full transition-colors ${done ? "bg-accent-500" : current ? "bg-navy-900" : "bg-slate-200"}`} />
                <span className={`mt-1.5 block text-[10.5px] sm:text-[11.5px] font-semibold ${current ? "whitespace-nowrap text-navy-900" : done ? "hidden sm:block truncate text-accent-600 group-hover:underline" : "hidden sm:block truncate text-slate-400"}`}>
                  {i + 1}. {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="rounded-[20px] bg-white border border-slate-200/90 overflow-hidden" style={{ boxShadow: "0 24px 60px rgba(12,21,36,0.10), 0 2px 6px rgba(12,21,36,0.05)" }}>
        <div className="p-5 sm:p-8">
          {draftRestored && stepIdx === 0 && (
            <div className="mb-5 flex items-start justify-between gap-3 rounded-lg bg-accent-50/60 border border-accent-500/20 px-4 py-3 text-[13px] text-navy-900">
              <span>We restored what you&apos;d entered earlier in this tab. Sensitive fields (SSN, tax ID, bank numbers) are never saved and will need to be re-entered.</span>
              <button type="button" className="shrink-0 text-[12px] font-semibold text-slate-500 hover:text-navy-900" onClick={() => { setApp({ ...emptyApplication(), startedAt: Date.now() }); setDraftRestored(false); }}>
                Start over
              </button>
            </div>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: EASE }}>
              {/* ── Step 1: Company ── */}
              {step === "company" && (
                <>
                  <SectionTitle title="Company profile" body="Tell us about the business as it's registered and where it operates." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput label="Merchant name (DBA)" value={c.dba} onChange={(v) => update("company.dba", v)} error={err("company.dba")} placeholder="The name customers know you by" autoComplete="organization" />
                    <TextInput label="Corporate / legal name" value={c.legalName} onChange={(v) => update("company.legalName", v)} error={err("company.legalName")} placeholder="As it appears on your tax filings" />
                    <Choice
                      label="Are the legal name and legal address the same as the DBA name and address?"
                      value={c.legalSameAsDba}
                      onChange={(v) => update("company.legalSameAsDba", v)}
                      options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
                      error={err("company.legalSameAsDba")}
                      className="sm:col-span-2"
                    />
                  </div>

                  <SubTitle>Location address</SubTitle>
                  <AddressFields base="company.location" value={c.location} update={update} err={err} autoComplete="address" />

                  <SubTitle>Corporate / billing address</SubTitle>
                  <Checkbox checked={c.billingSameAsLocation} onChange={(v) => update("company.billingSameAsLocation", v)}>
                    Same as the location address
                  </Checkbox>
                  {!c.billingSameAsLocation && (
                    <div className="mt-4">
                      <AddressFields base="company.billing" value={c.billing} update={update} err={err} />
                    </div>
                  )}

                  <SubTitle>Contacts</SubTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput label="Primary contact name" value={c.contactName} onChange={(v) => update("company.contactName", v)} error={err("company.contactName")} autoComplete="name" />
                    <TextInput label="Contact email" type="email" inputMode="email" value={c.contactEmail} onChange={(v) => update("company.contactEmail", v)} error={err("company.contactEmail")} hint="We'll send your confirmation and reference number here." autoComplete="email" />
                    <TextInput label="Telephone" type="tel" inputMode="tel" value={c.phone} onChange={(v) => update("company.phone", v)} format={fmtPhone} error={err("company.phone")} placeholder="(321) 555-0100" autoComplete="tel" />
                    <TextInput label="Mobile phone" type="tel" inputMode="tel" value={c.mobile} onChange={(v) => update("company.mobile", v)} format={fmtPhone} error={err("company.mobile")} optional autoComplete="tel" />
                    <TextInput label="Billing contact name" value={c.billingContactName} onChange={(v) => update("company.billingContactName", v)} optional hint="If someone else handles statements and invoices." />
                    <TextInput label="Billing contact email" type="email" inputMode="email" value={c.billingContactEmail} onChange={(v) => update("company.billingContactEmail", v)} error={err("company.billingContactEmail")} optional />
                  </div>

                  <SubTitle>Business details</SubTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select label="Type of business" value={c.businessType} onChange={(v) => update("company.businessType", v)} options={BUSINESS_TYPES} error={err("company.businessType")} />
                    {c.businessType.startsWith("LLC") ? (
                      <Select label="LLC tax classification" value={c.llcTaxClass} onChange={(v) => update("company.llcTaxClass", v)} options={LLC_TAX_CLASSES} error={err("company.llcTaxClass")} hint="How the IRS treats the LLC for tax purposes." />
                    ) : (
                      <TextInput label="Country of formation" value={c.countryOfFormation} onChange={(v) => update("company.countryOfFormation", v)} />
                    )}
                    {c.businessType.startsWith("LLC") && <TextInput label="Country of formation" value={c.countryOfFormation} onChange={(v) => update("company.countryOfFormation", v)} />}
                    <SecretInput
                      label="Federal Tax ID (EIN)"
                      value={c.federalTaxId}
                      onChange={(v) => update("company.federalTaxId", v)}
                      format={fmtEin}
                      inputMode="numeric"
                      error={err("company.federalTaxId")}
                      placeholder="12-3456789"
                      hint="Sole proprietors without an EIN can enter their SSN."
                    />
                    <Select label="Location type" value={c.siteType} onChange={(v) => update("company.siteType", v)} options={SITE_TYPES} error={err("company.siteType")} hint="Where the business physically operates." />
                    {c.siteType === "Other" && <TextInput label="Describe the location" value={c.siteTypeOther} onChange={(v) => update("company.siteTypeOther", v)} error={err("company.siteTypeOther")} />}
                  </div>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <TextInput label="Year established" inputMode="numeric" value={c.yearEstablished} onChange={(v) => update("company.yearEstablished", v)} format={onlyDigits(4)} error={err("company.yearEstablished")} placeholder="2012" />
                    <TextInput label="Years in business" value={c.yearsInBusiness} onChange={(v) => update("company.yearsInBusiness", v)} optional placeholder="e.g. 14 years" />
                    <TextInput label="Annual revenue" inputMode="decimal" value={c.annualRevenue} onChange={(v) => update("company.annualRevenue", v)} format={currency} prefix="$" error={err("company.annualRevenue")} placeholder="1,200,000" />
                    <TextInput label="Employees" inputMode="numeric" value={c.employees} onChange={(v) => update("company.employees", v)} format={onlyDigits(6)} error={err("company.employees")} placeholder="12" />
                  </div>
                </>
              )}

              {/* ── Step 2: Owners ── */}
              {step === "owners" && (
                <>
                  <SectionTitle title="Ownership profile" body="List each owner with a stake in the business. Together they must represent at least 50% of ownership. Processors require this to verify identity; it's the same information you'd give a bank." />
                  {errors["principals"] && (
                    <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-700" role="alert" data-error="true">
                      {errors["principals"]}
                    </p>
                  )}
                  {app.principals.map((p, i) => {
                    const base = `principals.${i}`;
                    return (
                      <div key={i} className={`${i > 0 ? "mt-8 pt-8 border-t border-slate-100" : ""}`}>
                        <SubTitle
                          right={
                            app.principals.length > 1 ? (
                              <button type="button" onClick={() => update("principals", app.principals.filter((_, j) => j !== i))} className="text-[12px] font-semibold text-slate-400 hover:text-red-600">
                                Remove
                              </button>
                            ) : null
                          }
                        >
                          Owner / principal #{i + 1}
                        </SubTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                          <TextInput className="sm:col-span-3" label="Full legal name" value={p.name} onChange={(v) => update(`${base}.name`, v)} error={err(`${base}.name`)} autoComplete="off" />
                          <TextInput className="sm:col-span-2" label="Title" value={p.title} onChange={(v) => update(`${base}.title`, v)} error={err(`${base}.title`)} placeholder="Owner, President…" />
                          <TextInput className="sm:col-span-1" label="% owned" inputMode="numeric" value={p.percentOwned} onChange={(v) => update(`${base}.percentOwned`, v)} format={pct} suffix="%" error={err(`${base}.percentOwned`)} />
                          <TextInput className="sm:col-span-3" label="Email" type="email" inputMode="email" value={p.email} onChange={(v) => update(`${base}.email`, v)} error={err(`${base}.email`)} />
                          <TextInput className="sm:col-span-3" label="Phone" type="tel" inputMode="tel" value={p.phone} onChange={(v) => update(`${base}.phone`, v)} format={fmtPhone} error={err(`${base}.phone`)} />
                          <TextInput className="sm:col-span-2" label="Date of birth" type="date" value={p.dob} onChange={(v) => update(`${base}.dob`, v)} error={err(`${base}.dob`)} max={new Date().toISOString().slice(0, 10)} autoComplete="off" />
                          <SecretInput className="sm:col-span-2" label="Social Security number" value={p.ssn} onChange={(v) => update(`${base}.ssn`, v)} format={fmtSsn} inputMode="numeric" error={err(`${base}.ssn`)} placeholder="•••-••-••••" hint="Encrypted before it reaches our team. Never stored on this site." />
                          <Select className="sm:col-span-1" label="ID type" value={p.idType} onChange={(v) => update(`${base}.idType`, v)} options={ID_TYPES} error={err(`${base}.idType`)} />
                          <TextInput className="sm:col-span-1" label="ID state" value={p.idState} onChange={(v) => update(`${base}.idState`, v)} error={err(`${base}.idState`)} placeholder="FL" hint="Or country, for a passport." />
                        </div>
                        <p className="mt-4 mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Home address</p>
                        <AddressFields base={`${base}.address`} value={p.address} update={update} err={err} />
                      </div>
                    );
                  })}
                  {app.principals.length < 4 && (
                    <button type="button" onClick={() => update("principals", [...app.principals, emptyPrincipal()])} className="mt-6 inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2.5 text-[13.5px] font-semibold text-navy-900 hover:border-accent-500 hover:bg-accent-50/40 transition-colors">
                      <span className="text-lg leading-none">+</span> Add another owner
                    </button>
                  )}
                </>
              )}

              {/* ── Step 3: Business ── */}
              {step === "business" && (
                <>
                  <SectionTitle title="Business profile" body="How you sell and what you process today. Estimates are fine — this helps us price the account correctly." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Textarea className="sm:col-span-2" label="Profile of the company" value={b.description} onChange={(v) => update("business.description", v)} error={err("business.description")} placeholder="Residential HVAC service and installation across Brevard County, 6 trucks, most jobs invoiced on site…" />
                    <Textarea className="sm:col-span-2" label="Products / services sold" rows={2} value={b.products} onChange={(v) => update("business.products", v)} error={err("business.products")} />
                    <TextInput label="Current processor" value={b.currentProcessor} onChange={(v) => update("business.currentProcessor", v)} optional placeholder="e.g. Heartland, Square, the bank…" />
                    <TextInput label="Current gateway / software" value={b.currentGateway} onChange={(v) => update("business.currentGateway", v)} optional placeholder="e.g. ServiceTitan, Housecall Pro, QuickBooks" />
                    <TextInput className="sm:col-span-2" label="Website" inputMode="url" value={b.website} onChange={(v) => update("business.website", v)} error={err("business.website")} optional placeholder="www.yourcompany.com" />
                  </div>

                  <SubTitle>How do you take cards?</SubTitle>
                  <p className="-mt-1 mb-3 text-[12.5px] text-slate-500">Rough percentages — they should add up to 100%.</p>
                  <div className="grid grid-cols-3 gap-4" data-error={err("business.mix") ? "true" : undefined}>
                    <TextInput label="Card present" inputMode="numeric" value={b.pctSwipe} onChange={(v) => update("business.pctSwipe", v)} format={pct} suffix="%" hint="Swipe, tap, chip" />
                    <TextInput label="Online" inputMode="numeric" value={b.pctInternet} onChange={(v) => update("business.pctInternet", v)} format={pct} suffix="%" hint="Website, pay links" />
                    <TextInput label="Phone / mail" inputMode="numeric" value={b.pctMoto} onChange={(v) => update("business.pctMoto", v)} format={pct} suffix="%" hint="Keyed in" />
                  </div>
                  {err("business.mix") && <p className="mt-2 text-[12.5px] text-red-600" role="alert">{err("business.mix")}</p>}

                  <SubTitle>Volume</SubTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <TextInput label="Estimated monthly volume" inputMode="decimal" value={b.monthlyVolume} onChange={(v) => update("business.monthlyVolume", v)} format={currency} prefix="$" error={err("business.monthlyVolume")} placeholder="85,000" />
                    <TextInput label="Average ticket" inputMode="decimal" value={b.averageTicket} onChange={(v) => update("business.averageTicket", v)} format={currency} prefix="$" error={err("business.averageTicket")} placeholder="650" />
                    <TextInput label="Highest ticket" inputMode="decimal" value={b.highestTicket} onChange={(v) => update("business.highestTicket", v)} format={currency} prefix="$" error={err("business.highestTicket")} placeholder="18,000" />
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Choice
                      label="Do you belong to an industry association?"
                      value={b.industryAssociation}
                      onChange={(v) => update("business.industryAssociation", v)}
                      options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
                      error={err("business.industryAssociation")}
                    />
                    {b.industryAssociation === "yes" && <TextInput label="Which one?" value={b.industryAssociationName} onChange={(v) => update("business.industryAssociationName", v)} error={err("business.industryAssociationName")} placeholder="e.g. CertainPath, ACCA, PHCC" />}
                  </div>
                </>
              )}

              {/* ── Step 4: Bank ── */}
              {step === "bank" && (
                <>
                  <SectionTitle title="Bank information" body="The business checking account where your card sales will be deposited and fees debited." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput className="sm:col-span-2" label="Bank name" value={k.bankName} onChange={(v) => update("bank.bankName", v)} error={err("bank.bankName")} autoComplete="off" />
                    <SecretInput label="ABA routing number" value={k.routing} onChange={(v) => update("bank.routing", v)} format={onlyDigits(9)} inputMode="numeric" error={err("bank.routing")} hint="9 digits, bottom-left of a check. We check it against the ABA formula." />
                    <div className="hidden sm:block" />
                    <SecretInput label="Account number" value={k.account} onChange={(v) => update("bank.account", v)} format={onlyDigits(17)} inputMode="numeric" error={err("bank.account")} />
                    <SecretInput label="Confirm account number" value={k.accountConfirm} onChange={(v) => update("bank.accountConfirm", v)} format={onlyDigits(17)} inputMode="numeric" error={err("bank.accountConfirm")} onPaste={(e) => e.preventDefault()} hint="Type it again — paste is disabled here on purpose." />
                  </div>
                  <TrustNote>
                    Bank details travel over an encrypted connection and are delivered to 321 Swipe inside a password-protected document. They are never written to this website&apos;s servers or saved in your browser.
                  </TrustNote>
                </>
              )}

              {/* ── Step 5: Documents ── */}
              {step === "documents" && (
                <>
                  <SectionTitle title="Supporting documents" body="Optional, but attaching them now usually shaves a day or two off approval. Photos are compressed in your browser and sealed inside the same encrypted document as your application." />
                  <div className="grid grid-cols-1 gap-4">
                    {DOCUMENT_SLOTS.map((slot) => (
                      <FileSlot key={slot.key} slot={slot} files={docs[slot.key]} busy={busyDocs} onAdd={(l) => addFiles(slot.key, l, "multiple" in slot && !!slot.multiple)} onRemove={(i) => removeFile(slot.key, i)} />
                    ))}
                  </div>
                  {docError && <p className="mt-3 text-[13px] text-red-600" role="alert">{docError}</p>}
                  <p className="mt-3 text-[12px] text-slate-400">
                    {totalBytes > 0 ? `${fmtBytes(totalBytes)} of 4 MB used.` : "Up to 4 MB total. "}
                    {" "}Don&apos;t have these handy? Skip this step — we&apos;ll send a secure upload link with your confirmation.
                  </p>

                  <details className="mt-6 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 text-[13px] text-slate-600">
                    <summary className="cursor-pointer font-semibold text-navy-900">What underwriting may ask for</summary>
                    <div className="mt-3 space-y-2 leading-relaxed">
                      <p><b className="text-navy-900">Retail / in-person:</b> if an on-site inspection isn&apos;t done, one of: a principal&apos;s license, certificate or articles of incorporation, or an operating agreement — the DBA or corporate name must match.</p>
                      <p><b className="text-navy-900">Online or phone / mail:</b> your last 3 months of processing statements. Websites need to show the company name, a support phone or email, refund policy, delivery timing, privacy policy, prices, and a secure checkout, with the domain registered to the business.</p>
                      <p><b className="text-navy-900">Non-profit:</b> proof of 501(c)(3) status.</p>
                      <p><b className="text-navy-900">Personal guarantee:</b> an SSN is required when a PG is signed. Without a PG, the most recent year of third-party reviewed or audited financials (plus that year&apos;s federal return if not prepared by a third party).</p>
                    </div>
                  </details>
                </>
              )}

              {/* ── Step 6: Review ── */}
              {step === "review" && (
                <>
                  <SectionTitle title="Review & sign" body="Check the summary, then sign by typing your name. Sensitive numbers are shown masked here." />
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[13.5px]">
                    <Review label="Business" onEdit={() => goTo(0)}>
                      <b>{c.dba}</b>{c.legalName && c.legalName !== c.dba ? ` (${c.legalName})` : ""}<br />
                      {c.businessType}{c.llcTaxClass ? ` · ${c.llcTaxClass}` : ""} · EIN {maskEin(c.federalTaxId)}<br />
                      {c.location.street}, {c.location.city}, {c.location.state} {c.location.zip}
                    </Review>
                    <Review label="Contact" onEdit={() => goTo(0)}>
                      {c.contactName}<br />{c.contactEmail}<br />{fmtPhone(c.phone)}
                    </Review>
                    <Review label="Owners" onEdit={() => goTo(1)}>
                      {app.principals.map((p, i) => (
                        <span key={i} className="block">{p.name} · {p.title} · {digits(p.percentOwned)}% · SSN {maskSsn(p.ssn)}</span>
                      ))}
                    </Review>
                    <Review label="Processing" onEdit={() => goTo(2)}>
                      ${b.monthlyVolume || "0"}/mo · avg ${b.averageTicket || "0"} · high ${b.highestTicket || "0"}<br />
                      {digits(b.pctSwipe) || 0}% card present · {digits(b.pctInternet) || 0}% online · {digits(b.pctMoto) || 0}% phone/mail
                    </Review>
                    <Review label="Bank" onEdit={() => goTo(3)}>
                      {k.bankName}<br />Routing ••••••{digits(k.routing).slice(-3)} · Account {maskAccount(k.account)}
                    </Review>
                    <Review label="Documents" onEdit={() => goTo(4)}>
                      {Object.values(docs).flat().length ? Object.values(docs).flat().map((p, i) => <span key={i} className="block truncate">{p.originalName}</span>) : <span className="text-slate-400">None attached</span>}
                    </Review>
                  </dl>

                  <SubTitle>Certification</SubTitle>
                  <div className="space-y-3">
                    <Checkbox checked={app.signature.accurate} onChange={(v) => update("signature.accurate", v)} error={err("signature.accurate")}>
                      I certify that the information in this application is true, complete and accurate to the best of my knowledge.
                    </Checkbox>
                    <Checkbox checked={app.signature.authorize} onChange={(v) => update("signature.authorize", v)} error={err("signature.authorize")}>
                      I authorize 321 Swipe and its processing partners to verify this information, including with the bank named above and, where permitted by law, through credit and identity checks on the business and its listed owners. I understand this application is a request for services and does not itself create a merchant agreement.
                    </Checkbox>
                  </div>
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-[1.6fr_1fr] gap-4">
                    <TextInput label="Type your full name to sign" value={app.signature.name} onChange={(v) => update("signature.name", v)} error={err("signature.name")} placeholder={app.principals[0]?.name || "Full legal name"} autoComplete="off" className="[&_input]:font-serif [&_input]:italic [&_input]:text-[18px]" />
                    <TextInput label="Title" value={app.signature.title} onChange={(v) => update("signature.title", v)} error={err("signature.title")} placeholder={app.principals[0]?.title || "Owner"} />
                  </div>
                  <p className="mt-2 text-[12px] text-slate-400">Your typed name, the date and time, and your IP address are recorded with the application as your electronic signature.</p>

                  {TURNSTILE_KEY && (
                    <div className="mt-5">
                      <div ref={turnstileEl} />
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {submitError && (
            <p className="mt-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-700" role="alert">
              {submitError}
            </p>
          )}

          {/* Nav */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              {stepIdx > 0 && (
                <button type="button" onClick={() => goTo(stepIdx - 1)} className="text-[13.5px] font-semibold text-slate-500 hover:text-navy-900">
                  ← Back
                </button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-[12px] text-slate-400">Step {stepIdx + 1} of {STEPS.length}</span>
              <motion.button
                type="button"
                onClick={step === "review" ? submit : next}
                disabled={status === "submitting" || busyDocs}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-lg text-white font-semibold text-sm px-7 py-3 disabled:opacity-60 whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #0c1524 0%, #132040 100%)", boxShadow: "0 1px 4px rgba(12,21,36,0.28), 0 6px 20px rgba(12,21,36,0.14), inset 0 1px 0 rgba(255,255,255,0.06)" }}
              >
                {status === "submitting" ? "Encrypting & sending…" : step === "review" ? "Submit application" : step === "documents" && totalBytes === 0 ? "Skip for now →" : "Continue →"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Pieces ─────────────────────────────────────────────────────────────────

function AddressFields({ base, value, update, err, autoComplete }: { base: string; value: Application["company"]["location"]; update: (p: string, v: unknown) => void; err: (p: string) => string | undefined; autoComplete?: string }) {
  const ac = (part: string) => (autoComplete ? `${part}` : "off");
  return (
    <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
      <TextInput className="col-span-2 sm:col-span-6" label="Street address" value={value.street} onChange={(v) => update(`${base}.street`, v)} error={err(`${base}.street`)} autoComplete={ac("street-address")} />
      <TextInput className="col-span-2 sm:col-span-2" label="City" value={value.city} onChange={(v) => update(`${base}.city`, v)} error={err(`${base}.city`)} autoComplete={ac("address-level2")} />
      <Select className="sm:col-span-1" label="State" value={value.state} onChange={(v) => update(`${base}.state`, v)} options={US_STATES} error={err(`${base}.state`)} placeholder="—" />
      <TextInput className="sm:col-span-1" label="ZIP" inputMode="numeric" value={value.zip} onChange={(v) => update(`${base}.zip`, v)} error={err(`${base}.zip`)} autoComplete={ac("postal-code")} />
      <TextInput className="col-span-2 sm:col-span-2" label="Country" value={value.country} onChange={(v) => update(`${base}.country`, v)} autoComplete={ac("country-name")} />
    </div>
  );
}

function FileSlot({ slot, files, busy, onAdd, onRemove }: { slot: (typeof DOCUMENT_SLOTS)[number]; files: Prepared[]; busy: boolean; onAdd: (l: FileList | null) => void; onRemove: (i: number) => void }) {
  const id = `doc-${slot.key}`;
  const multiple = "multiple" in slot && !!slot.multiple;
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-navy-900">{slot.label}</p>
          <p className="mt-0.5 text-[12.5px] text-slate-500 leading-snug">{slot.hint}</p>
        </div>
        <label htmlFor={id} className={`shrink-0 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-navy-900 cursor-pointer hover:border-accent-500 hover:bg-accent-50/40 transition-colors ${busy ? "opacity-50 pointer-events-none" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 16V4m0 0l-4 4m4-4l4 4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" /></svg>
          {files.length && !multiple ? "Replace" : "Add"}
        </label>
        <input id={id} type="file" accept={slot.accept} multiple={multiple} className="sr-only" onChange={(e) => { onAdd(e.target.files); e.target.value = ""; }} />
      </div>
      {files.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {files.map((p, i) => (
            <li key={i} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-[12.5px]">
              <span className="min-w-0 truncate text-navy-900">{p.originalName}</span>
              <span className="shrink-0 flex items-center gap-3 text-slate-400">
                {fmtBytes(p.file.size)}{p.kind === "image" && p.originalBytes > p.file.size * 1.5 ? ` (from ${fmtBytes(p.originalBytes)})` : ""}
                <button type="button" onClick={() => onRemove(i)} className="font-semibold text-slate-500 hover:text-red-600">Remove</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Review({ label, onEdit, children }: { label: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3.5 min-w-0">
      <div className="flex items-center justify-between">
        <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
        <button type="button" onClick={onEdit} className="text-[12px] font-semibold text-accent-600 hover:text-accent-500">Edit</button>
      </div>
      <dd className="mt-1.5 text-navy-900 leading-relaxed break-words">{children}</dd>
    </div>
  );
}

function TrustNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-lg bg-emerald-50/70 border border-emerald-200/70 px-4 py-3 text-[12.5px] text-emerald-900 leading-relaxed">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
      <span>{children}</span>
    </div>
  );
}
