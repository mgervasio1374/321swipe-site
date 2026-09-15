"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { PhotoFrame } from "@/app/components/ui/PhotoFrame";
import { AnalysisCard } from "@/app/components/sections/AnalysisCard";
import { EASE } from "@/app/lib/animations";

interface VerianSectionProps {
  photo: string | null;
  title: React.ReactNode;
  body: string;
  bullets: string[];
  cta?: { label: string; onClick: () => void };
}

/** Dark Verian section for subpages: copy + checklist on the left, cycling analysis card on the right. */
export function VerianSection({ photo, title, body, bullets, cta }: VerianSectionProps) {
  return (
    <section
      id="intelligence"
      className="relative py-28 lg:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #ffffff 0%, #f1f5f9 5%, #94a3b8 14%, #1e293b 26%, #0d1e3a 38%, #060d1c 52%)" }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[22%] bottom-0 opacity-[0.22]">
        <PhotoFrame src={photo} alt="" tone="navy" motion="parallax" position="50% 40%" className="absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #060d1c 0%, rgba(6,13,28,0.2) 35%, rgba(6,13,28,0.6) 100%)" }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 50% at 20% 50%, rgba(37,99,235,0.14) 0%, transparent 60%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div>
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-navy-700/60 bg-navy-800/40 px-3.5 py-1.5 text-xs font-semibold text-navy-100/90 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
                Verian Intelligence Platform
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-tight">{title}</h2>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <p className="mt-5 text-[15px] text-navy-100/70 leading-relaxed max-w-lg">{body}</p>
            </ScrollReveal>

            <div className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {bullets.map((b, i) => (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.12 + i * 0.07, duration: 0.4, ease: EASE }}
                  className="flex items-center gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-accent-500/20 border border-accent-500/30 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-2.5 h-2.5 text-accent-400">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-sm text-navy-100/80">{b}</span>
                </motion.div>
              ))}
            </div>

            {cta && (
              <ScrollReveal delay={0.5}>
                <button
                  onClick={cta.onClick}
                  className="mt-9 inline-flex items-center gap-2 rounded-lg text-white text-sm font-semibold px-6 py-3 transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)", boxShadow: "0 1px 4px rgba(37,99,235,0.3)" }}
                >
                  {cta.label}
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70">
                    <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              </ScrollReveal>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.18, ease: EASE }}
            className="relative"
          >
            <div
              aria-hidden
              className="absolute -inset-8 rounded-[2rem] blur-3xl opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(ellipse, #3b82f6 0%, #2563eb 40%, transparent 70%)" }}
            />
            <AnalysisCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
