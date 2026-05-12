"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/app/lib/animations";

type Step = "idle" | "submitting" | "success" | "error";

const INPUT =
  "w-full rounded-lg bg-navy-900/60 border border-navy-700/60 px-3.5 py-2.5 text-sm text-white placeholder:text-navy-100/30 focus:outline-none focus:border-accent-500/60 focus:bg-navy-900/80 transition-colors";

const LABEL = "block text-[10.5px] font-semibold uppercase tracking-wide text-navy-100/40 mb-1.5";

export function LeadModal() {
  const [open, setOpen]     = useState(false);
  const [step, setStep]     = useState<Step>("idle");
  const [file, setFile]     = useState<File | null>(null);
  const [dragging, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm]     = useState({ name: "", company: "", email: "", phone: "", processor: "" });

  useEffect(() => {
    const open = () => { setOpen(true); setStep("idle"); setFile(null); setForm({ name: "", company: "", email: "", phone: "", processor: "" }); };
    window.addEventListener("open-lead-modal", open);
    return () => window.removeEventListener("open-lead-modal", open);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const field = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value })),
  });

  const pickFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) return;
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("submitting");
    const fd = new FormData();
    fd.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "");
    fd.append("subject", `Statement Review Request — ${form.company || form.name}`);
    fd.append("from_name", "321 Swipe Website");
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("company", form.company);
    if (form.processor) fd.append("current_processor", form.processor);
    if (file) fd.append("statement", file, file.name);

    try {
      const res  = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
      const data = await res.json();
      setStep(data.success ? "success" : "error");
    } catch {
      setStep("error");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm"
          />

          {/* Panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 18 }}
              transition={{ duration: 0.26, ease: EASE }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg pointer-events-auto rounded-2xl overflow-y-auto max-h-[92vh]"
              style={{
                background: "linear-gradient(145deg, #0f1e3a 0%, #0c1524 100%)",
                boxShadow: "0 0 0 1px rgba(37,99,235,0.2), 0 32px 80px rgba(0,0,0,0.65)",
              }}
            >
              {/* Close */}
              <button
                onClick={close}
                className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-navy-800/60 flex items-center justify-center text-navy-100/50 hover:text-white hover:bg-navy-700/60 transition-colors"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                </svg>
              </button>

              {/* ── Success state ── */}
              {step === "success" ? (
                <div className="p-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-5">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-400">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Request Received</h3>
                  <p className="text-sm text-navy-100/55 leading-relaxed mb-7 max-w-xs mx-auto">
                    We'll review your information and reach out within one business day. Keep an eye on your inbox.
                  </p>
                  <button
                    onClick={close}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-navy-800/60 border border-navy-700/60 text-sm font-medium text-white hover:bg-navy-700/60 transition-colors"
                  >
                    Close
                  </button>
                </div>

              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                  {/* Header */}
                  <div className="mb-6 pr-8" style={{ borderBottom: "1px solid rgba(37,99,235,0.12)", paddingBottom: "1.25rem" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-navy-100/40">Free · No obligation</span>
                    </div>
                    <h2 className="text-lg font-bold text-white leading-snug">Request a Free Statement Review</h2>
                    <p className="text-xs text-navy-100/50 mt-1.5 leading-relaxed">
                      We'll analyze your processor statement and show you exactly what you're paying — and where you're overpaying.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    {/* Name + Company */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={LABEL}>Name *</label>
                        <input required type="text" placeholder="Mike H." className={INPUT} {...field("name")} />
                      </div>
                      <div>
                        <label className={LABEL}>Company *</label>
                        <input required type="text" placeholder="Apex Roofing LLC" className={INPUT} {...field("company")} />
                      </div>
                    </div>

                    {/* Email + Phone */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={LABEL}>Email *</label>
                        <input required type="email" placeholder="you@company.com" className={INPUT} {...field("email")} />
                      </div>
                      <div>
                        <label className={LABEL}>Phone *</label>
                        <input required type="tel" placeholder="(555) 000-0000" className={INPUT} {...field("phone")} />
                      </div>
                    </div>

                    {/* Processor */}
                    <div>
                      <label className={LABEL}>
                        Current Processor <span className="normal-case font-normal opacity-60">(optional)</span>
                      </label>
                      <input type="text" placeholder="e.g. Heartland, Square, Stripe…" className={INPUT} {...field("processor")} />
                    </div>

                    {/* File drop zone */}
                    <div>
                      <label className={LABEL}>
                        Attach Statement <span className="normal-case font-normal opacity-60">(optional · PDF, JPG, PNG · 10 MB max)</span>
                      </label>
                      <div
                        onDragOver={e => { e.preventDefault(); setDrag(true); }}
                        onDragLeave={() => setDrag(false)}
                        onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) pickFile(f); }}
                        onClick={() => fileRef.current?.click()}
                        className={`relative rounded-xl border-2 border-dashed px-4 py-4 text-center cursor-pointer transition-colors ${
                          dragging
                            ? "border-accent-500/60 bg-accent-500/5"
                            : "border-navy-700/50 hover:border-navy-600/60 hover:bg-navy-800/20"
                        }`}
                      >
                        <input
                          ref={fileRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="sr-only"
                          onChange={e => { const f = e.target.files?.[0]; if (f) pickFile(f); }}
                        />
                        {file ? (
                          <div className="flex items-center justify-center gap-2">
                            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-accent-400 shrink-0">
                              <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2L9.5 1.5z" />
                            </svg>
                            <span className="text-xs text-white font-medium truncate max-w-[200px]">{file.name}</span>
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                              className="text-navy-100/40 hover:text-white ml-1 shrink-0"
                            >
                              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                                <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-navy-100/25 mx-auto mb-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                            </svg>
                            <p className="text-xs text-navy-100/35">
                              Drag & drop or <span className="text-accent-400">browse</span>
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="mt-5">
                    <button
                      type="submit"
                      disabled={step === "submitting"}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                      style={{
                        background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                        boxShadow: "0 1px 4px rgba(37,99,235,0.3), 0 6px 20px rgba(37,99,235,0.18)",
                      }}
                    >
                      {step === "submitting" ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          Request Free Statement Review
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70">
                            <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                          </svg>
                        </>
                      )}
                    </button>

                    {step === "error" && (
                      <p className="mt-2.5 text-xs text-red-400 text-center">
                        Something went wrong. Please try again or email us directly.
                      </p>
                    )}

                    <p className="mt-3 text-center text-[10.5px] text-navy-100/25">
                      🔒 No obligation · Information never shared
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
