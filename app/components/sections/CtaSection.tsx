"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { Button } from "@/app/components/ui/Button";

const trustPoints = [
  "No long-term contracts",
  "Free statement review",
  "No setup fees",
  "Human support included",
];

export function CtaSection() {
  return (
    <section
      id="review"
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #f8fafc 0%, #060d1c 6%)" }}
    >
      {/* Background radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(37,99,235,0.15) 0%, transparent 55%)",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">

        {/* Logo — white text version shows perfectly on dark navy */}
        <ScrollReveal>
          <div className="flex justify-center mb-10">
            <Image
              src="/logo-white.svg"
              alt="321 Swipe"
              width={200}
              height={80}
              className="opacity-90"
              style={{ height: "auto" }}
              priority={false}
            />
          </div>
        </ScrollReveal>

        {/* Badge */}
        <ScrollReveal delay={0.06}>
          <span className="inline-flex items-center gap-2 rounded-full border border-navy-700 bg-navy-800/50 px-3.5 py-1.5 text-xs font-semibold text-navy-100 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
            Free for any contractor
          </span>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={0.12}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            See what your current processing
            <br className="hidden sm:block" />{" "}
            is really costing you.
          </h2>
        </ScrollReveal>

        {/* Sub */}
        <ScrollReveal delay={0.2}>
          <p className="mt-6 text-base sm:text-lg text-navy-100/70 leading-relaxed max-w-2xl mx-auto">
            Most contractors overpay by{" "}
            <span className="text-white font-semibold">$400–$1,200 per month</span>{" "}
            without knowing it. A free statement review takes 15 minutes and gives
            you a clear picture of where that money is going.
          </p>
        </ScrollReveal>

        {/* CTAs */}
        <ScrollReveal delay={0.28}>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              onClick={() => window.dispatchEvent(new Event("open-lead-modal"))}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-navy-900 font-semibold text-sm px-7 py-3.5 hover:bg-slate-50 transition-colors shadow-lg shadow-black/20"
            >
              Request a Free Statement Review
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
              </svg>
            </motion.button>
            <Button variant="ghost" onClick={() => (window as any).Tawk_API?.maximize?.()} className="text-navy-100 hover:text-white hover:bg-white/10 text-sm px-7 py-3.5">
              Talk to 321 Swipe
            </Button>
          </div>
        </ScrollReveal>

        {/* Trust checkmarks */}
        <ScrollReveal delay={0.36}>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {trustPoints.map((point) => (
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

      {/* Footer strip */}
      <div className="relative mt-24 border-t border-navy-800/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Image
            src="/logo-white.svg"
            alt="321 Swipe"
            width={120}
            height={48}
            className="opacity-60 hover:opacity-80 transition-opacity"
            style={{ height: "auto" }}
          />
          <p className="text-xs text-navy-100/30 text-center">
            © {new Date().getFullYear()} 321 Swipe. Independent, contractor-first payment intelligence.
          </p>
          <div className="flex gap-5 text-xs text-navy-100/30">
            <a href="#" className="hover:text-navy-100/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-navy-100/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-navy-100/60 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </section>
  );
}
