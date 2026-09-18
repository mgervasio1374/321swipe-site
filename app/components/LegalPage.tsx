"use client";

import Link from "next/link";
import { SubpageHeader } from "@/app/components/navigation/SubpageHeader";
import { SiteFooter } from "@/app/components/navigation/SiteFooter";

const openModal = () => window.dispatchEvent(new Event("open-lead-modal"));

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

interface LegalPageProps {
  label: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  /** Link to the sibling legal page. */
  sibling: { label: string; href: string };
}

/** Plain, readable layout for Privacy and Terms. Prose in sentences, not legalese blocks. */
export function LegalPage({ label, title, intro, updated, sections, sibling }: LegalPageProps) {
  return (
    <>
      <SubpageHeader label={label} cta={{ label: "Request a review", onClick: openModal }} />
      <main className="bg-white">
        <section
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(130deg, #f9fbfe 0%, #f1f5f9 40%, #f9fbfe 100%)" }}
        >
          <div className="relative mx-auto max-w-3xl px-6 pt-28 pb-12 lg:pt-32 lg:pb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-accent-500">{label}</p>
            <h1 className="mt-3 font-bold tracking-[-0.03em] leading-[1.08] text-navy-900" style={{ fontSize: "clamp(2rem, 4vw, 2.9rem)" }}>
              {title}
            </h1>
            <p className="mt-5 text-[1rem] text-slate-500 leading-[1.72]">{intro}</p>
            <p className="mt-4 text-[12px] text-slate-400">Last updated {updated}</p>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 grid gap-12 lg:grid-cols-[180px_1fr] lg:gap-16">
            <nav aria-label="Sections" className="hidden lg:block lg:sticky lg:top-24 self-start">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 mb-3">On this page</p>
              <ol className="flex flex-col gap-2">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-[12.5px] text-slate-500 hover:text-navy-900 transition-colors leading-snug block">
                      <span className="text-slate-300 tabular-nums mr-1.5">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
              <Link href={sibling.href} className="mt-6 inline-block text-[12.5px] font-semibold text-accent-600 hover:text-accent-500">
                {sibling.label} →
              </Link>
            </nav>

            <div className="flex flex-col gap-10">
              {sections.map((s, i) => (
                <article key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="text-[19px] font-bold text-navy-900 tracking-tight leading-snug">
                    <span className="text-slate-300 font-mono text-[13px] mr-2 align-middle">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </h2>
                  <div className="mt-3 text-[15px] text-slate-600 leading-[1.75] flex flex-col gap-3 [&_strong]:text-navy-900 [&_a]:text-accent-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5">
                    {s.body}
                  </div>
                </article>
              ))}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
                <Link href={sibling.href} className="font-semibold text-accent-600 hover:text-accent-500">{sibling.label} →</Link>
                <Link href="/" className="text-slate-400 hover:text-navy-900">Back to 321swipe.com</Link>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-navy-950">
          <SiteFooter />
        </div>
      </main>
    </>
  );
}
