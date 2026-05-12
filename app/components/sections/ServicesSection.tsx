"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { EASE } from "@/app/lib/animations";

// ── Featured (large) services ─────────────────────────────────────────────────
const featuredServices = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Statement Analysis",
    subtitle: "Where the money is",
    body: "A human analyst reviews your processor statement every month. We find what you're being overcharged, explain it in plain English, and fix it — without you having to ask.",
    tags: ["Monthly human review", "Hidden fee identification", "Rate optimization"],
    accent: "from-emerald-50/60 to-teal-50/30",
    iconBg: "bg-emerald-600",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    title: "Payment Processing",
    subtitle: "The foundation",
    body: "All card types. Interchange-plus pricing with full transparency. Next-day funding. No hidden fees, no rate creep, no surprises on your monthly statement.",
    tags: ["All card types", "Next-day funding", "Interchange-plus", "No hidden fees"],
    accent: "from-navy-50 to-accent-50/40",
    iconBg: "bg-accent-500",
  },
];

// ── Supporting services ───────────────────────────────────────────────────────
const supportingServices = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Surcharging",
    body: "Compliant surcharge programs designed to help offset processing costs while protecting the customer experience. We assist with setup, signage, and program guidance.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    title: "Mobile Payments",
    body: "Tap-to-pay, digital invoices, and instant receipts — built for crews in the field, not at a desk. Works where your jobs happen.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 014-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 01-4 4H3" />
      </svg>
    ),
    title: "Recurring Billing",
    body: "Subscription and auto-billing for service agreements, maintenance plans, and annual contracts. Set it up once and collect reliably.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "Contractor Workflows",
    body: "Job-level reporting, payment links for estimates and invoices, and integrations with the tools your crew already uses.",
  },
];

export function ServicesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-surface border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">
              Services
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-tight tracking-tight">
              Everything a home service contractor needs.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.16}>
            <p className="mt-4 text-base text-slate-500 leading-relaxed">
              Not a generic processor. A payment partner that understands field
              operations, job-level cash flow, and the real complexity of running
              a trades business.
            </p>
          </ScrollReveal>
        </div>

        {/* Featured cards — 2-col, more prominent */}
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          {featuredServices.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: EASE }}
              whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" as const } }}
              className={`group bg-gradient-to-br ${service.accent} rounded-2xl border border-slate-200 p-7 flex flex-col gap-5 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100/90 transition-shadow cursor-default`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl ${service.iconBg} flex items-center justify-center text-white shadow-md`}>
                  {service.icon}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white/70 px-2.5 py-1 rounded-full border border-slate-200/60">
                  {service.subtitle}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-navy-900 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{service.body}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {service.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-medium text-slate-500 bg-white/80 border border-slate-200/80 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Supporting cards — 4-col, lighter weight */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportingServices.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.45, ease: EASE }}
              whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" as const } }}
              className="group bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/80 transition-shadow cursor-default"
            >
              <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center text-navy-700 group-hover:bg-navy-900 group-hover:text-white transition-colors duration-250">
                {service.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-navy-900 mb-1.5">{service.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{service.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
