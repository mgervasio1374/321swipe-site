"use client";

import { motion } from "framer-motion";
import { SubpageHeader } from "@/app/components/navigation/SubpageHeader";
import { SiteFooter } from "@/app/components/navigation/SiteFooter";
import { EASE } from "@/app/lib/animations";
import { ApplyForm } from "./ApplyForm";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: EASE },
});

const PROTECTIONS = [
  {
    title: "Encrypted in transit",
    body: "Everything you enter travels over TLS (the padlock in your browser) straight to our own server — no third-party form service in between.",
  },
  {
    title: "Sealed before delivery",
    body: "Your application is turned into a password-protected, AES-256 encrypted document before it's sent to our team. Photos of checks and IDs go inside it.",
  },
  {
    title: "Never stored here",
    body: "This website keeps nothing. The submission exists in memory only long enough to be encrypted and delivered, then it's gone.",
  },
  {
    title: "Masked everywhere else",
    body: "Your SSN, tax ID and account numbers are hidden on screen and never saved in your browser — only the last four digits appear outside the sealed document.",
  },
];

const NEEDS = ["Legal business name, address and EIN", "Each owner's SSN, date of birth and ID", "Business checking routing & account number", "Rough monthly volume and average ticket"];

export function ApplyPage() {
  return (
    <>
      <SubpageHeader label="Merchant Application" cta={{ label: "Email sales", onClick: () => { window.location.href = "mailto:sales@321swipe.com?subject=Merchant%20application%20question"; } }} />

      <main className="pt-[60px]" style={{ background: "linear-gradient(180deg, #f9fbfe 0%, #f1f5f9 30%, #f8fafc 100%)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 lg:items-start">
          {/* Form column */}
          <div className="min-w-0">
            <motion.div {...fade(0)} className="mb-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-600">Secure online application</p>
              <h1 className="mt-2 text-[30px] sm:text-[38px] font-bold tracking-tight text-navy-900 leading-[1.08]">321 Swipe Merchant Application</h1>
              <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl">
                About 10 minutes. Your progress is kept in this tab if you need to step away, and nothing sensitive is saved anywhere until you press submit.
              </p>
            </motion.div>

            <motion.div {...fade(0.08)}>
              <ApplyForm />
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.aside {...fade(0.16)} className="mt-10 lg:mt-0 lg:sticky lg:top-24 space-y-5">
            <div className="rounded-2xl bg-white border border-slate-200/90 p-6" style={{ boxShadow: "0 2px 6px rgba(12,21,36,0.05)" }}>
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
                </span>
                <h2 className="text-[15px] font-bold text-navy-900">How your information is protected</h2>
              </div>
              <ul className="mt-4 space-y-3.5">
                {PROTECTIONS.map((p) => (
                  <li key={p.title}>
                    <p className="text-[13px] font-semibold text-navy-900">{p.title}</p>
                    <p className="mt-0.5 text-[12.5px] text-slate-500 leading-relaxed">{p.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200/90 p-6" style={{ boxShadow: "0 2px 6px rgba(12,21,36,0.05)" }}>
              <h2 className="text-[15px] font-bold text-navy-900">Have these handy</h2>
              <ul className="mt-3 space-y-2">
                {NEEDS.map((n) => (
                  <li key={n} className="flex items-start gap-2.5 text-[13px] text-slate-600 leading-snug">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                    {n}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[12.5px] text-slate-500 leading-relaxed">
                Prefer a PDF? <a href="/321-swipe-merchant-application-fillable.pdf" className="font-semibold text-accent-600 hover:text-accent-500">Download the fillable application</a>, complete it on your computer, and return it through our{" "}
                <a href="https://upload.321swipe.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent-600 hover:text-accent-500">secure upload portal</a>. A{" "}
                <a href="/321-swipe-merchant-application.pdf" className="underline">print version</a> is available too.
              </p>
            </div>

            <p className="px-1 text-[12px] text-slate-400 leading-relaxed">
              Need help partway through? Call or email <a href="mailto:sales@321swipe.com" className="text-slate-500 underline">sales@321swipe.com</a> — we&apos;re happy to finish it with you over the phone.
            </p>
          </motion.aside>
        </div>

        <div className="bg-navy-950">
          <SiteFooter />
        </div>
      </main>
    </>
  );
}
