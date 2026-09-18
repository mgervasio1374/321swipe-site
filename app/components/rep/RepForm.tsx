"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/app/lib/animations";
import type { Rep } from "@/app/lib/reps";

/**
 * Contact / statement form for rep pages (see lib/reps.ts).
 *
 * Delivery is FormSubmit (formsubmit.co) → rep.email. No account needed;
 * the first submission triggers a one-time activation email to that inbox.
 *
 * - No file attached → AJAX endpoint, in-page success state.
 * - File attached   → native multipart POST (attachments only work that way),
 *                     FormSubmit redirects back to /<slug>?sent=1.
 *
 * After activation, FormSubmit offers a random alias in place of the address
 * (Settings → "Unique form string"); swap it into ENDPOINT to keep the address
 * out of the page source.
 */
const SITE = "https://321swipe.com";

type Mode = "message" | "statement";
type Step = "idle" | "submitting" | "success" | "error";

const INPUT =
  "w-full min-w-0 rounded-lg bg-white border border-slate-200 px-3.5 py-2.5 text-[14px] text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-colors";
const LABEL = "block text-[10.5px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5";

export function RepForm({ rep, id = "contact" }: { rep: Rep; id?: string }) {
  const EMAIL = rep.email;
  const ENDPOINT = `https://formsubmit.co/${EMAIL}`;
  const [mode, setMode] = useState<Mode>("statement");
  const [step, setStep] = useState<Step>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Returning from a native (attachment) submission.
  useEffect(() => {
    try {
      if (new URLSearchParams(window.location.search).get("sent") === "1") {
        setStep("success");
        document.getElementById(id)?.scrollIntoView({ block: "start" });
      }
    } catch {}
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("statement");
    const hasFile = file instanceof File && file.size > 0;
    if (hasFile) return; // let the browser POST natively so the attachment goes through

    e.preventDefault();
    setStep("submitting");
    fd.delete("statement");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      setStep(res.ok && (data.success === "true" || data.success === true) ? "success" : "error");
    } catch {
      setStep("error");
    }
  };

  return (
    <div
      id={id}
      className="scroll-mt-24 rounded-[20px] bg-white border border-slate-200/90 overflow-hidden"
      style={{ boxShadow: "0 24px 60px rgba(12,21,36,0.10), 0 2px 6px rgba(12,21,36,0.05)" }}
    >
      {/* Mode tabs */}
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] border-b border-slate-100 bg-slate-50/70">
        {(
          [
            { k: "statement", label: `Send ${rep.firstName} a statement`, sub: "Free line-by-line review" },
            { k: "message", label: `Ask ${rep.firstName} a question`, sub: "A personal reply, not a queue" },
          ] as { k: Mode; label: string; sub: string }[]
        ).map((t) => (
          <button
            key={t.k}
            type="button"
            onClick={() => { setMode(t.k); setStep("idle"); }}
            className={`relative min-w-0 px-4 sm:px-5 py-4 text-left transition-colors ${mode === t.k ? "bg-white" : "hover:bg-white/60"}`}
          >
            <span className={`block text-[14px] font-semibold ${mode === t.k ? "text-navy-900" : "text-slate-500"}`}>{t.label}</span>
            <span className="block text-[11.5px] text-slate-400 mt-0.5">{t.sub}</span>
            {mode === t.k && (
              <motion.span layoutId={`${rep.slug}-tab`} className="absolute left-0 right-0 -bottom-px h-[2px] bg-accent-500" />
            )}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-7">
        <AnimatePresence mode="wait" initial={false}>
          {step === "success" ? (
            <motion.div
              key="ok"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="py-6 text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-[20px] font-bold text-navy-900 tracking-tight">Got it — {rep.firstName} has your message.</h3>
              <p className="mt-2 text-[14px] text-slate-500 leading-relaxed max-w-sm mx-auto">
                She&apos;ll reach out within one business day. If you sent a statement, she&apos;ll come back with it marked
                up line by line.
              </p>
              <button
                type="button"
                onClick={() => { setStep("idle"); setFileName(null); formRef.current?.reset(); }}
                className="mt-6 text-[13px] font-semibold text-accent-600 hover:text-accent-500"
              >
                Send another
              </button>
            </motion.div>
          ) : (
            <motion.form
              key={mode}
              ref={formRef}
              action={ENDPOINT}
              method="POST"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="grid grid-cols-[minmax(0,1fr)] gap-4"
            >
              {/* FormSubmit config */}
              <input type="hidden" name="_subject" value={mode === "statement" ? `Statement for review — ${rep.pageName}` : `Question — ${rep.pageName}`} />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value={`${SITE}/${rep.slug}?sent=1`} />
              <input type="hidden" name="source" value={`321swipe.com/${rep.slug}`} />
              <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

              <div className="grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL} htmlFor={`${id}-name`}>Your name</label>
                  <input id={`${id}-name`} required name="name" type="text" placeholder="Jane Doe" className={INPUT} />
                </div>
                <div>
                  <label className={LABEL} htmlFor={`${id}-business`}>Business</label>
                  <input id={`${id}-business`} required name="business" type="text" placeholder="ABC Company" className={INPUT} />
                </div>
                <div>
                  <label className={LABEL} htmlFor={`${id}-email`}>Email</label>
                  <input id={`${id}-email`} required name="email" type="email" placeholder="you@business.com" className={INPUT} />
                </div>
                <div>
                  <label className={LABEL} htmlFor={`${id}-phone`}>Phone</label>
                  <input id={`${id}-phone`} name="phone" type="tel" placeholder="(717) 000-0000" className={INPUT} />
                </div>
              </div>

              {mode === "statement" ? (
                <>
                  <div>
                    <label className={LABEL} htmlFor={`${id}-file`}>Your most recent statement</label>
                    <label
                      htmlFor={`${id}-file`}
                      className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50/60 px-4 py-3.5 cursor-pointer hover:border-accent-500 hover:bg-accent-50/40 transition-colors"
                    >
                      <span className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-navy-900 flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13.5px] font-medium text-navy-900 truncate">
                          {fileName ?? "Attach a PDF or a photo of the statement"}
                        </span>
                        <span className="block text-[11.5px] text-slate-400">A phone photo of the fee page is fine. Up to 10 MB.</span>
                      </span>
                    </label>
                    <input
                      id={`${id}-file`}
                      name="statement"
                      type="file"
                      accept=".pdf,image/*"
                      className="sr-only"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                    />
                  </div>
                  <div>
                    <label className={LABEL} htmlFor={`${id}-processor`}>Current processor (optional)</label>
                    <input id={`${id}-processor`} name="current_processor" type="text" placeholder="e.g. Heartland, Square, the bank…" className={INPUT} />
                  </div>
                </>
              ) : (
                <div>
                  <label className={LABEL} htmlFor={`${id}-message`}>What can {rep.firstName} help with?</label>
                  <textarea
                    id={`${id}-message`}
                    required
                    name="message"
                    rows={4}
                    placeholder="We take cards at the market stand and in the shop, and I've never really understood our statement…"
                    className={`${INPUT} resize-y`}
                  />
                </div>
              )}

              {step === "error" && (
                <p className="text-[13px] text-red-600">
                  Something went wrong sending that. You can email {rep.firstName} directly at{" "}
                  <a className="underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>.
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                <motion.button
                  type="submit"
                  disabled={step === "submitting"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg text-white font-semibold text-sm px-6 py-3 disabled:opacity-60 whitespace-nowrap shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #0c1524 0%, #132040 100%)",
                    boxShadow: "0 1px 4px rgba(12,21,36,0.28), 0 6px 20px rgba(12,21,36,0.14), inset 0 1px 0 rgba(255,255,255,0.06)",
                  }}
                >
                  {step === "submitting" ? "Sending…" : mode === "statement" ? `Send to ${rep.firstName}` : "Send message"}
                </motion.button>
                <p className="text-[11.5px] text-slate-400 leading-relaxed">
                  Goes straight to {rep.firstName}&apos;s inbox. Statements are used for your review only and never shared.
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
