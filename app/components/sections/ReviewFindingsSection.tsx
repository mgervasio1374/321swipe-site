"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { PhotoFrame } from "@/app/components/ui/PhotoFrame";
import { EASE } from "@/app/lib/animations";

export interface Finding {
  icon: React.ReactNode;
  title: string;
  body: string;
}

interface Props {
  photo: string | null;
  title: string;
  body: string;
  note?: string;
  findings: Finding[];
  cta: { label: string; onClick?: () => void; href?: string };
  /** Optional secondary text link, e.g. to a partner Statement Decoder. */
  secondary?: { label: string; href: string };
  background?: "white" | "surface";
}

/** "What a review finds" — sticky copy on the left, 3×2 findings grid with a photo beneath. */
export function ReviewFindingsSection({ photo, title, body, note, findings, cta, secondary, background = "white" }: Props) {
  const arrow = (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70">
      <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
    </svg>
  );
  const btn = "inline-flex items-center gap-2 rounded-lg bg-navy-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-navy-800 transition-colors";

  return (
    <section id="diagnostic" className={`py-24 lg:py-28 ${background === "white" ? "bg-white" : "bg-surface"} border-t border-slate-100`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.55fr] gap-16 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-28">
            <ScrollReveal>
              <span className={`inline-flex items-center gap-2 rounded-full border border-slate-200 ${background === "white" ? "bg-surface" : "bg-white"} px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6`}>
                Statement review
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-[1.1] tracking-tight">{title}</h2>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-sm">{body}</p>
            </ScrollReveal>
            {note && (
              <ScrollReveal delay={0.24}>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm">{note}</p>
              </ScrollReveal>
            )}
            <ScrollReveal delay={0.32}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {cta.href ? (
                  <a href={cta.href} target="_blank" rel="noopener noreferrer" className={btn}>
                    {cta.label} {arrow}
                  </a>
                ) : (
                  <button onClick={cta.onClick} className={btn}>
                    {cta.label} {arrow}
                  </button>
                )}
                {secondary && (
                  <Link href={secondary.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:text-accent-500 transition-colors">
                    {secondary.label} {arrow}
                  </Link>
                )}
              </div>
            </ScrollReveal>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {findings.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.08, duration: 0.45, ease: EASE }}
                className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-slate-300 hover:bg-white hover:shadow-sm transition-all cursor-default"
              >
                <div className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-accent-500 mb-3.5 group-hover:border-accent-200 group-hover:bg-accent-50 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-navy-900 mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
            <ScrollReveal delay={0.1} className="sm:col-span-2">
              <PhotoFrame
                src={photo}
                alt="Hands marking line items on a printed processor statement with a highlighter"
                brief="Tight crop: hands with a highlighter marking line items on a printed statement, laptop edge visible."
                tone="warm"
                motion="parallax"
                position="50% 45%"
                className="h-[220px] rounded-2xl"
              />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
