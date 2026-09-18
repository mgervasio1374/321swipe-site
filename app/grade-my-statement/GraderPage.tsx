"use client";

import { motion } from "framer-motion";
import { SubpageHeader } from "@/app/components/navigation/SubpageHeader";
import { ClosingCta } from "@/app/components/sections/ClosingCta";
import { EASE } from "@/app/lib/animations";
import type { PhotoMap } from "@/app/lib/photos";
import { Grader } from "./Grader";

const openModal = () => window.dispatchEvent(new Event("open-lead-modal"));
const fade = (delay: number) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: EASE } });

export function GraderPage({ photos }: { photos: PhotoMap }) {
  return (
    <>
      <SubpageHeader label="Grade my statement" cta={{ label: "Request a review", onClick: openModal }} />
      <main>
        <section className="relative overflow-hidden" style={{ background: "linear-gradient(130deg, #f9fbfe 0%, #f1f5f9 40%, #f9fbfe 100%)" }}>
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(12,21,36,0.07) 1.2px, transparent 1.2px)", backgroundSize: "40px 40px", opacity: 0.22 }} />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-10 lg:pt-32 lg:pb-14">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-end">
              <div>
                <motion.div {...fade(0.05)}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50/90 px-3.5 py-1.5 text-xs font-semibold text-navy-700 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                    Two-minute check
                  </span>
                </motion.div>
                <motion.h1 {...fade(0.15)} className="mt-6 max-w-[18ch] font-bold tracking-[-0.038em] leading-[1.05] text-navy-900" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)" }}>
                  How good is your processing deal,{" "}
                  <span style={{ background: "linear-gradient(125deg, #1a3ed4 0%, #2563eb 40%, #60a5fa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    really?
                  </span>
                </motion.h1>
              </div>
              <motion.div {...fade(0.28)} className="lg:pb-2">
                <p className="text-[1rem] text-slate-500 leading-[1.72] max-w-[440px]">
                  Six questions, no statement required. You&apos;ll get a letter grade, the specific things pulling it down, and a link you can send to your bookkeeper — or to us.
                </p>
                <p className="mt-4 text-[12px] text-slate-400">Nothing is stored. Your answers live only in the link.</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="grader" className="relative pb-20 lg:pb-28 bg-surface">
          <div aria-hidden className="absolute inset-x-0 top-0 h-32" style={{ background: "linear-gradient(180deg, #f1f5f9 0%, transparent 100%)" }} />
          <motion.div {...fade(0.4)} className="relative pt-2 mx-auto max-w-3xl px-4 sm:px-6">
            <Grader />
          </motion.div>
        </section>

        <ClosingCta
          photo={photos["van-dusk"]}
          badge="Free statement review"
          title="Want the real grade?"
          body="The quiz scores your answers. A review scores the statement itself. Send one and see how close the guess was."
          primary={{ label: "Request a statement review", href: "https://upload.321swipe.com" }}
          trustPoints={["Free", "Compare it to your quiz grade", "No obligation either way"]}
        />
      </main>
    </>
  );
}
