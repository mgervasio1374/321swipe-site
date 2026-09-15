"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { PhotoFrame } from "@/app/components/ui/PhotoFrame";
import { Button } from "@/app/components/ui/Button";

const trustPoints = [
  "No long-term contracts",
  "Free statement review",
  "No setup fees",
  "Human support included",
];

const footerColumns = [
  {
    heading: "Company",
    links: [
      { label: "Why 321 Swipe", href: "#about" },
      { label: "Statement review", href: "#diagnostic" },
      { label: "Merchant advisory", href: "/advisory" },
      { label: "Services", href: "#features" },
    ],
  },
  {
    heading: "Partners",
    links: [
      { label: "CertainPath", href: "/certainpath" },
      { label: "Blue Collar Success Group", href: "/blue-collar-success-group" },
    ],
  },
  {
    heading: "Get in touch",
    links: [
      { label: "Request a statement review", href: "https://upload.321swipe.com" },
      { label: "Talk to 321 Swipe", href: "#chat" },
    ],
  },
];

export function CtaSection({ photo }: { photo: string | null }) {
  return (
    <section id="review" className="relative overflow-hidden bg-navy-950">
      {/* Background photography — heavily darkened so the copy stays legible */}
      <PhotoFrame
        src={photo}
        alt=""
        tone="navy"
        motion="parallax"
        position="50% 60%"
        className="absolute inset-x-0 top-24 bottom-0 opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #f8fafc 0%, rgba(6,13,28,0.82) 12%, rgba(6,13,28,0.55) 50%, #060d1c 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(37,99,235,0.18) 0%, transparent 55%)" }}
      />

      <div className="relative mx-auto max-w-4xl px-6 lg:px-8 pt-28 lg:pt-36 pb-20 lg:pb-24 text-center">
        <ScrollReveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-navy-700 bg-navy-800/50 px-3.5 py-1.5 text-xs font-semibold text-navy-100 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
            Free for any contractor
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            See what your current processing
            <br className="hidden sm:block" />{" "}
            is really costing you.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="mt-6 text-base sm:text-lg text-navy-100/70 leading-relaxed max-w-2xl mx-auto">
            Many contractors discover hundreds of dollars per month in avoidable fees during their
            first review. A free statement review gives you a clear picture of what you are paying —
            and what you should not be.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.28}>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <motion.a
              href="https://upload.321swipe.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-navy-900 font-semibold text-sm px-7 py-3.5 hover:bg-slate-50 transition-colors shadow-lg shadow-black/30"
            >
              Request a Free Statement Review
            </motion.a>
            <Button
              variant="ghost"
              onClick={() => window.Tawk_API?.maximize?.()}
              className="text-navy-100 hover:text-white hover:bg-white/10 text-sm px-7 py-3.5 border border-white/15"
            >
              Talk to 321 Swipe
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.36}>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {trustPoints.map((point) => (
              <span key={point} className="flex items-center gap-1.5 text-xs text-navy-100/50">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-accent-400">
                  <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
                </svg>
                {point}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* ── Footer ── */}
      <footer className="relative border-t border-navy-800/70">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Image
              src="/logo-white.svg"
              alt="321 Swipe"
              width={120}
              height={48}
              className="opacity-80"
              style={{ height: "auto", maxHeight: "32px", width: "auto" }}
            />
            <p className="text-[12.5px] text-navy-100/45 leading-relaxed max-w-[300px]">
              Independent, contractor-first payment intelligence for the trades.
            </p>
            {/* TODO: Replace with the registered ISO/MSP disclosure once legal language is provided. */}
            <p className="text-[11px] text-navy-100/30 leading-relaxed max-w-[340px]">
              321 Swipe is an independent payment advisory and processing partner for home service
              contractors.
            </p>
          </div>
          {footerColumns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white mb-1">{col.heading}</p>
              {col.links.map((link) =>
                link.href === "#chat" ? (
                  <button
                    key={link.label}
                    onClick={() => window.Tawk_API?.maximize?.()}
                    className="text-left text-[13px] text-navy-100/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-[13px] text-navy-100/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11.5px] text-navy-100/30">
          <p>© {new Date().getFullYear()} 321 Swipe. All rights reserved.</p>
          {/* TODO: point these at real pages once Privacy and Terms copy exists. */}
          <div className="flex gap-5">
            <a href="#" className="hover:text-navy-100/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-navy-100/60 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </section>
  );
}
