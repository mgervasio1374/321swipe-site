"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SubpageHeader } from "@/app/components/navigation/SubpageHeader";
import { ClosingCta } from "@/app/components/sections/ClosingCta";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";
import type { PhotoMap } from "@/app/lib/photos";
import { SOFTWARE, type SoftwareItem } from "@/app/lib/software";
import { track } from "@/app/lib/analytics";

const openModal = () => window.dispatchEvent(new Event("open-lead-modal"));
const fade = (delay: number) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: EASE } });

const CATEGORIES = ["All", "Analysis", "Education", "Pricing", "Operations", "Platform"] as const;

const toneBg = {
  navy: "linear-gradient(160deg, #1a3460 0%, #0c1524 100%)",
  warm: "radial-gradient(ellipse 70% 60% at 70% 20%, rgba(251,191,36,0.35) 0%, transparent 60%), linear-gradient(160deg, #1e3a5f 0%, #0c1524 100%)",
  light: "radial-gradient(ellipse 70% 60% at 30% 20%, rgba(255,255,255,0.9) 0%, transparent 60%), linear-gradient(160deg, #eef4fb 0%, #c7d7ea 100%)",
};

const arrow = (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70">
    <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
  </svg>
);

function Shot({ item, src }: { item: SoftwareItem; src: string | null }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${item.name} screenshot`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex items-end p-5" style={{ background: toneBg[item.tone ?? "navy"] }}>
          <div className="grain absolute inset-0 opacity-20" aria-hidden />
          <div className="relative">
            <p className={`text-[9.5px] font-bold uppercase tracking-[0.12em] ${item.tone === "light" ? "text-navy-700/70" : "text-blue-300"}`}>
              {item.status === "soon" ? "Screenshot coming" : "Preview"}
            </p>
            <p className={`mt-1 text-[22px] font-bold tracking-tight leading-none ${item.tone === "light" ? "text-navy-900" : "text-white"}`}>{item.name}</p>
          </div>
        </div>
      )}
      <div className="absolute top-3 left-3 flex gap-1.5">
        <span className="rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-900 shadow-sm">{item.category}</span>
        {item.status === "soon" && (
          <span className="rounded-full bg-navy-900/85 backdrop-blur px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm">In progress</span>
        )}
        {item.status === "internal" && (
          <span className="rounded-full bg-amber-500/90 backdrop-blur px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm">Internal tool</span>
        )}
        {item.status === "demo" && (
          <span className="rounded-full bg-accent-500/90 backdrop-blur px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm">Pilot demo</span>
        )}
      </div>
    </div>
  );
}

function Card({ item, src, i }: { item: SoftwareItem; src: string | null; i: number }) {
  const external = item.href?.startsWith("http");
  const body = (
    <>
      <Shot item={item} src={src} />
      <div className="p-5 sm:p-6 flex flex-col flex-1 min-w-0">
        <h3 className="text-[18px] font-bold text-navy-900 tracking-tight leading-snug">{item.name}</h3>
        <p className="mt-1 text-[13.5px] font-medium text-accent-600">{item.tagline}</p>
        <p className="mt-3 text-[13.5px] text-slate-600 leading-relaxed flex-1">{item.description.replace(/\s*\[.*?\]/g, "")}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span key={t} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600">{t}</span>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <span className="text-[11.5px] text-slate-400 truncate">For {item.audience.toLowerCase()}</span>
          {item.href ? (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy-900 group-hover:text-accent-600 transition-colors whitespace-nowrap">
              {external ? "Open" : "Try it"} {arrow}
            </span>
          ) : (
            <span className="text-[12px] font-semibold text-slate-400 whitespace-nowrap">{item.status === "internal" ? "Used in every review" : "Demo coming"}</span>
          )}
        </div>
      </div>
    </>
  );
  const cls = "group flex flex-col h-full rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 hover:border-slate-300 transition-all";
  const onOpen = () => track({ name: "software_open", tool: item.slug, status: item.status });
  return (
    <motion.div
      layout
      className="min-w-0"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: (i % 3) * 0.06, duration: 0.45, ease: EASE }}
    >
      {item.href ? (
        external ? (
          <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onOpen}>{body}</a>
        ) : (
          <Link href={item.href} className={cls} onClick={onOpen}>{body}</Link>
        )
      ) : (
        <div className={`${cls} cursor-default`}>{body}</div>
      )}
    </motion.div>
  );
}

export function SoftwarePage({ photos, shots }: { photos: PhotoMap; shots: Record<string, string | null> }) {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const items = SOFTWARE.filter((s) => cat === "All" || s.category === cat);
  const live = SOFTWARE.filter((s) => s.status === "live" || s.status === "demo").length;

  return (
    <>
      <SubpageHeader label="Software" cta={{ label: "Request a review", onClick: openModal }} />
      <main>
        <section className="relative overflow-hidden" style={{ background: "linear-gradient(130deg, #f9fbfe 0%, #f1f5f9 40%, #f9fbfe 100%)" }}>
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(12,21,36,0.07) 1.2px, transparent 1.2px)", backgroundSize: "40px 40px", opacity: 0.22 }} />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-12 lg:pt-32 lg:pb-16">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-end">
              <div>
                <motion.div {...fade(0.05)}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50/90 px-3.5 py-1.5 text-xs font-semibold text-navy-700 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                    Built by 321 Swipe
                  </span>
                </motion.div>
                <motion.h1 {...fade(0.15)} className="mt-6 max-w-[18ch] font-bold tracking-[-0.038em] leading-[1.05] text-navy-900" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)" }}>
                  The tools behind a{" "}
                  <span style={{ background: "linear-gradient(125deg, #1a3ed4 0%, #2563eb 40%, #60a5fa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    modern payments company.
                  </span>
                </motion.h1>
              </div>
              <motion.div {...fade(0.28)} className="lg:pb-2">
                <p className="text-[1rem] text-slate-500 leading-[1.72] max-w-[460px]">
                  Most processors sell a rate. We build software that shows a business what it is actually paying and why.
                  Everything here is real and working. {live} of them you can open right now; the rest run on our own desks, behind every review we deliver.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-surface">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                    cat === c ? "bg-navy-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <motion.div layout className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              <AnimatePresence mode="popLayout">
                {items.map((item, i) => (
                  <Card key={item.slug} item={item} src={shots[item.slug] ?? null} i={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
            <div>
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">Why we build</span>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-[1.1] tracking-tight">
                  Transparency is a product, not a promise.
                </h2>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.16}>
              <div className="text-[15.5px] text-slate-600 leading-[1.75] flex flex-col gap-4">
                <p>
                  Every processor says it&apos;s transparent. Almost none of them will put a statement on a screen and walk you
                  through it line by line, because the statement is where the margin hides. We built these tools so that the
                  walkthrough happens whether or not a rep is in the room.
                </p>
                <p>
                  They share one set of data — the same fee definitions power the decoder, the dictionary and the report card — so
                  when interchange changes or a processor invents a new fee, we update it once and every tool learns it. The
                  in-house analysis engine that produces our monthly client reviews runs on the same foundation.
                </p>
                <p>
                  If you run a partner organization and want a version of any of these branded for your members, that&apos;s a
                  configuration, not a project. <Link href="/advisory" className="font-semibold text-accent-600 hover:text-accent-500">Talk to us →</Link>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <ClosingCta
          photo={photos["van-dusk"]}
          badge="Try the real thing"
          title="Software is the demo. The review is the product."
          body="Send one recent statement and get it back the way our tools show it — every line labeled, every avoidable fee totaled, and a plain answer on what to do next."
          primary={{ label: "Request a statement review", href: "https://upload.321swipe.com" }}
          trustPoints={["No obligation", "Nothing to install", "Reviewed by a person, not a form", "Month-to-month if you switch"]}
        />
      </main>
    </>
  );
}
