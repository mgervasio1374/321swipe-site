"use client";

import { motion } from "framer-motion";
import { SubpageHeader } from "@/app/components/navigation/SubpageHeader";
import { SplitPhotoHero } from "@/app/components/hero/SplitPhotoHero";
import { AdvisorySection } from "@/app/components/sections/AdvisorySection";
import { ClosingCta } from "@/app/components/sections/ClosingCta";
import { PhotoFrame } from "@/app/components/ui/PhotoFrame";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";
import type { PhotoMap } from "@/app/lib/photos";
import { CarynForm } from "./CarynForm";

// ── Helpers ───────────────────────────────────────────────────────────────────
const goToForm = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });

// ── Data ──────────────────────────────────────────────────────────────────────
const industries: {
  photo: keyof PhotoMap;
  title: string;
  who: string;
  insight: string;
  alt: string;
  brief: string;
  position?: string;
}[] = [
  {
    photo: "caryn-farm-market",
    title: "Farm markets, greenhouses & produce auctions",
    who: "Fruit farms, greenhouses, mulch yards, produce auctions, jersey dairies",
    insight: "Volume that arrives in one season and a checkout that has to be fast. Caryn watches for tiered plans that punish rewards cards at the register and for minimums that bite in January.",
    alt: "A farm market checkout with baskets of produce and a customer tapping a card",
    brief: "Farm market stand under a wooden roof, crates of tomatoes and sweet corn, a woman in an apron holding out a card reader to a customer. Bright summer morning.",
    position: "50% 45%",
  },
  {
    photo: "caryn-sheds",
    title: "Sheds, structures & outdoor living",
    who: "Shed builders, storage buildings, structural movers, patio and outdoor-living retailers",
    insight: "Big tickets, deposits and balances. A $9,000 shed on a card can trigger large-ticket interchange and surcharge rules most processors never mention. Caryn sets those up right.",
    alt: "A row of finished wooden sheds on a display lot with a salesman and a couple",
    brief: "Display lot of Amish-built sheds in a row, a salesman with a tablet walking a couple past a red-roofed model. Late afternoon, Lancaster County farmland behind.",
    position: "50% 55%",
  },
  {
    photo: "caryn-machine-shop",
    title: "Machine, hydraulic & metal shops",
    who: "Hydraulics, welding and fabrication, steel supply, machine shops, manufacturers",
    insight: "Business-to-business cards, invoices paid over the phone, parts counters. Level II and III data can knock a full percentage point off commercial-card transactions — if the system sends it.",
    alt: "A hydraulic shop parts counter with a technician taking a phone order",
    brief: "Parts counter in a hydraulic repair shop, hoses and fittings on the wall, a technician in a work shirt keying a card payment into a terminal while on the phone. Fluorescent light, clean and busy.",
  },
  {
    photo: "caryn-equipment",
    title: "Auto, truck, trailer & equipment",
    who: "Repair garages, used-car lots, trailer dealers, tractor and equipment sales, rental yards",
    insight: "Repair orders one day, a $14,000 trailer the next. Caryn looks at the mix of small and large tickets so the pricing fits both, and makes sure deposits and rentals settle cleanly.",
    alt: "A trailer and equipment dealer's lot with a customer settling up at the service window",
    brief: "Trailer dealership lot with utility trailers and a compact tractor, a customer at the service window handing over a card. Overcast sky, gravel lot.",
  },
  {
    photo: "caryn-country-store",
    title: "Restaurants, bakeries & country stores",
    who: "Bakeries, grills, soft pretzels, dry goods, groceries, fabric and gift shops, bookstores",
    insight: "Lots of small tickets, so the per-item fees matter more than the rate. Caryn checks batch, statement and PCI charges — the flat fees that quietly eat a small store's margin.",
    alt: "A country store counter with baked goods and a customer paying by card",
    brief: "Country store counter with a glass case of whoopie pies and shoofly pie, a young cashier in a head covering handing a receipt to a customer. Warm wood, morning light through the front window.",
  },
  {
    photo: "caryn-ministry",
    title: "Ministries, nonprofits & mutual aid",
    who: "Ministries, publishers, mutual-aid societies, schools and community organizations",
    insight: "Donations, tuition and event payments deserve nonprofit interchange rates and clear reporting. Caryn makes sure the account is coded correctly — a common miss that costs ministries every month.",
    alt: "Volunteers at a ministry office table processing donations",
    brief: "Two volunteers at a folding table in a plain church fellowship hall, a laptop and a small card reader between them, sorting envelopes. Soft window light, simple and calm.",
  },
];

const steps = [
  {
    n: "01",
    title: "Send Caryn one statement",
    body: "The most recent one is fine — a phone photo of the fee page works. Nothing to sign, nothing to install.",
  },
  {
    n: "02",
    title: "She walks you through it",
    body: "In person if you're nearby, or by phone. Every line explained, every avoidable fee totaled, in plain English.",
  },
  {
    n: "03",
    title: "Switch only if the numbers say so",
    body: "If your current setup is fair, Caryn will tell you. If it isn't, she moves you over on month-to-month terms and stays on the account.",
  },
];

// ── Hero visual: a recent review card ────────────────────────────────────────
function ReviewCard() {
  const lines = [
    { label: "Non-qualified surcharge", amount: "$186.20", flag: true },
    { label: "PCI non-compliance fee", amount: "$39.95", flag: true },
    { label: "Batch fee × 26", amount: "$6.50", flag: true },
    { label: "Interchange (pass-through)", amount: "$921.14", flag: false },
  ];
  return (
    <div className="relative select-none">
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}>
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 0 0 1px rgba(12,21,36,0.06), 0 16px 48px rgba(12,21,36,0.18), 0 40px 90px rgba(37,99,235,0.12)" }}
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <div>
              <p className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-[0.08em]">Example review</p>
              <p className="text-[13px] font-bold text-navy-900 mt-0.5">Farm market · 2 stands + online</p>
            </div>
            <span className="text-[10px] font-semibold text-accent-600 bg-accent-50 border border-accent-100 px-2.5 py-1 rounded-full">Marked up by Caryn</span>
          </div>
          <div className="p-5">
            <div className="flex flex-col gap-2 text-[12px]">
              {lines.map((l) => (
                <div key={l.label} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className={`w-1.5 h-1.5 rounded-full ${l.flag ? "bg-red-500" : "bg-emerald-500"}`} />
                    {l.label}
                  </span>
                  <b className={`tabular-nums ${l.flag ? "text-red-600" : "text-slate-700"}`}>{l.amount}</b>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl p-3 bg-slate-50 border border-slate-200">
                <p className="text-[8.5px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Effective rate</p>
                <p className="text-[20px] font-bold tabular-nums leading-none text-slate-700">3.41%</p>
                <p className="text-[8.5px] text-slate-400 mt-0.5">Before</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.18)" }}>
                <p className="text-[8.5px] font-semibold uppercase tracking-widest text-slate-400 mb-1">After review</p>
                <p className="text-[20px] font-bold tabular-nums leading-none text-accent-600">2.58%</p>
                <p className="text-[8.5px] text-slate-400 mt-0.5">≈ $3,900 a year</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function CarynPage({ photos }: { photos: PhotoMap }) {
  return (
    <>
      <SubpageHeader label="Savings by Caryn" cta={{ label: "Talk to Caryn", onClick: goToForm }} />

      <main>
        <SplitPhotoHero
          badge={
            <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50/90 px-3.5 py-1.5 text-xs font-semibold text-navy-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
              Your 321 Swipe rep · Lancaster County &amp; central PA
            </span>
          }
          lines={["Meet Caryn.", "Card fees, decoded.", "Neighbor to neighbor."]}
          body="Caryn Hales works with the businesses that keep this part of Pennsylvania running — farm markets, shed builders, hydraulic shops, bakeries, ministries. She reads your processor statement with you, line by line, and tells you plainly what's fair and what isn't."
          primary={{ label: "Send Caryn a statement", onClick: goToForm }}
          secondary={{ label: "Ask a question", onClick: goToForm }}
          trustItems={[
            { strong: "Free", label: "statement review" },
            { strong: "Independent,", label: "not PE-owned" },
            { strong: "Month-to-month", label: "if you switch" },
          ]}
          photo={{
            src: photos["caryn-hero"],
            alt: "A produce stand owner taking a card payment from a customer on a summer morning",
            brief: "Lancaster County roadside produce stand, a woman in her 40s in a plain dress and apron tapping a customer's card on a handheld reader, crates of peaches and sweet corn, farmland and a white barn behind. Warm morning light.",
            position: "55% 40%",
            tone: "warm",
          }}
          visual={<ReviewCard />}
        />

        {/* ── Who Caryn works with ── */}
        <section id="who" className="py-24 lg:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 lg:gap-16 items-end mb-12">
              <div>
                <ScrollReveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
                    Who Caryn works with
                  </span>
                </ScrollReveal>
                <ScrollReveal delay={0.08}>
                  <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-[1.1] tracking-tight">
                    Not just contractors. <span className="text-accent-500">Every kind of local business.</span>
                  </h2>
                </ScrollReveal>
              </div>
              <ScrollReveal delay={0.16}>
                <p className="text-base text-slate-500 leading-relaxed max-w-lg lg:pb-1">
                  321 Swipe started with the trades. Caryn&apos;s customers are the rest of Main Street and the back roads —
                  from produce auctions to hydraulic shops to mutual-aid societies. Each one pays for cards a little
                  differently, and each one has a different place where the money leaks.
                </p>
              </ScrollReveal>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {industries.map((ind, i) => (
                <motion.article
                  key={ind.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: (i % 3) * 0.08, duration: 0.5, ease: EASE }}
                  className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 hover:border-slate-300 transition-all"
                >
                  <PhotoFrame
                    src={photos[ind.photo]}
                    alt={ind.alt}
                    brief={ind.brief}
                    tone={i % 2 ? "navy" : "light"}
                    motion="none"
                    position={ind.position}
                    className="h-[200px]"
                  />
                  <div className="p-5">
                    <h3 className="text-[15.5px] font-bold text-navy-900 leading-snug tracking-tight">{ind.title}</h3>
                    <p className="mt-1.5 text-[12px] text-slate-400 leading-snug">{ind.who}</p>
                    <p className="mt-3 text-[13.5px] text-slate-600 leading-relaxed">{ind.insight}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how" className="py-24 lg:py-28 bg-surface border-y border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
              <div>
                <ScrollReveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50 px-3.5 py-1.5 text-xs font-semibold text-navy-700 mb-6">
                    How it works
                  </span>
                </ScrollReveal>
                <ScrollReveal delay={0.08}>
                  <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-[1.1] tracking-tight">
                    One statement. One honest conversation.
                  </h2>
                </ScrollReveal>
                <ScrollReveal delay={0.16}>
                  <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-md">
                    No sales pitch on the first call. Caryn&apos;s job is to make sure you understand what you&apos;re paying —
                    whether or not you ever process a card with 321 Swipe.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.28}>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      onClick={goToForm}
                      className="inline-flex items-center gap-2 rounded-lg bg-navy-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-navy-800 transition-colors"
                    >
                      Start with a statement
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-70">
                        <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <a href="/statement-decoder" className="text-[13px] font-semibold text-accent-600 hover:text-accent-500">
                      Or see a statement decoded first →
                    </a>
                  </div>
                </ScrollReveal>
              </div>

              <div className="grid gap-4">
                {steps.map((s, i) => (
                  <motion.div
                    key={s.n}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                    className="flex gap-5 rounded-2xl bg-white border border-slate-200 p-5 sm:p-6"
                    style={{ boxShadow: "0 8px 30px rgba(12,21,36,0.05)" }}
                  >
                    <span className="text-[12px] font-mono font-semibold text-accent-500 pt-1">{s.n}</span>
                    <div>
                      <h3 className="text-[16px] font-bold text-navy-900 tracking-tight">{s.title}</h3>
                      <p className="mt-1.5 text-[14px] text-slate-500 leading-relaxed">{s.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Advisory (shared homepage section) ── */}
        <AdvisorySection photo={photos.analyst} />

        {/* ── Contact / statement form ── */}
        <section className="py-24 lg:py-28 bg-surface border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">
              <div className="lg:sticky lg:top-24">
                <ScrollReveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50 px-3.5 py-1.5 text-xs font-semibold text-navy-700 mb-6">
                    Reach Caryn
                  </span>
                </ScrollReveal>
                <ScrollReveal delay={0.08}>
                  <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-[1.1] tracking-tight">
                    Send a statement, or just ask.
                  </h2>
                </ScrollReveal>
                <ScrollReveal delay={0.16}>
                  <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-md">
                    Everything on this form goes directly to Caryn — not a queue, not a call center. She answers within one
                    business day, usually sooner.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.24}>
                  <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-[15px] shrink-0">CH</div>
                    <div>
                      <p className="text-[15px] font-bold text-navy-900">Caryn Hales</p>
                      <p className="text-[12.5px] text-slate-500">Payment advisor, 321 Swipe · Lancaster County &amp; central Pennsylvania</p>
                      <a href="mailto:savingsbycaryn@gmail.com" className="mt-2 inline-block text-[13px] font-semibold text-accent-600 hover:text-accent-500">
                        savingsbycaryn@gmail.com
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                  <p className="mt-5 text-[12px] text-slate-400 leading-relaxed max-w-md">
                    Prefer the secure portal? You can also{" "}
                    <a href="https://upload.321swipe.com?rep=caryn" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy-900">
                      upload a statement at upload.321swipe.com
                    </a>{" "}
                    and it will be routed to Caryn.
                  </p>
                </ScrollReveal>
              </div>

              <ScrollReveal direction="right" className="min-w-0">
                <CarynForm id="contact" />
              </ScrollReveal>
            </div>
          </div>
        </section>

        <ClosingCta
          photo={photos["van-dusk"]}
          badge="Savings by Caryn"
          title="Ready when you are."
          body="One statement is all it takes to find out what you're really paying. Send it to Caryn, and she'll come back with it marked up and a plain answer on what to do next."
          primary={{ label: "Send Caryn a statement", onClick: goToForm }}
          trustPoints={["Free, no obligation", "Reviewed by Caryn, not a form", "Independent, not PE-owned", "Month-to-month if you switch"]}
          id="cta"
        />
      </main>
    </>
  );
}
