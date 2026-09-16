"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { PhotoFrame } from "@/app/components/ui/PhotoFrame";
import { Button } from "@/app/components/ui/Button";
import { SiteFooter } from "@/app/components/navigation/SiteFooter";

interface ClosingCtaProps {
  photo: string | null;
  badge: string;
  title: React.ReactNode;
  body: string;
  primary: { label: string; href?: string; onClick?: () => void };
  secondaryLabel?: string;
  trustPoints: string[];
  /** Section id for in-page anchors. */
  id?: string;
}

/**
 * Dark closing section with the van-at-dusk photo behind it, followed by the
 * shared footer. Used by the homepage and every subpage so the site ends the
 * same way everywhere.
 */
export function ClosingCta({
  photo,
  badge,
  title,
  body,
  primary,
  secondaryLabel = "Talk to 321 Swipe",
  trustPoints,
  id = "review",
}: ClosingCtaProps) {
  const primaryClass =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-white text-navy-900 font-semibold text-sm px-7 py-3.5 hover:bg-slate-50 transition-colors shadow-lg shadow-black/30";

  return (
    <section id={id} className="relative overflow-hidden bg-navy-950">
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
            {badge}
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">{title}</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="mt-6 text-base sm:text-lg text-navy-100/70 leading-relaxed max-w-2xl mx-auto">{body}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.28}>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            {primary.href ? (
              <motion.a
                href={primary.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.97 }}
                className={primaryClass}
              >
                {primary.label}
              </motion.a>
            ) : (
              <motion.button
                onClick={primary.onClick}
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.97 }}
                className={primaryClass}
              >
                {primary.label}
              </motion.button>
            )}
            <Button
              variant="ghost"
              onClick={() => window.Tawk_API?.maximize?.()}
              className="text-navy-100 hover:text-white hover:bg-white/10 text-sm px-7 py-3.5 border border-white/15"
            >
              {secondaryLabel}
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

      <SiteFooter />
    </section>
  );
}
