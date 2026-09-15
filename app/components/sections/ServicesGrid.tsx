"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";
import { PhotoFrame } from "@/app/components/ui/PhotoFrame";
import { EASE } from "@/app/lib/animations";

export interface FeaturedService {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  body: string;
  tags: string[];
  photo: { src: string | null; alt: string; tone?: "navy" | "warm" | "light" };
}

export interface SupportingService {
  icon: React.ReactNode;
  title: string;
  body: string;
}

interface Props {
  title: string;
  body?: string;
  featured: FeaturedService[];
  supporting: SupportingService[];
}

/** Services section — two photo-headed feature cards plus a row of supporting cards. */
export function ServicesGrid({ title, body, featured, supporting }: Props) {
  const cols = supporting.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4";
  return (
    <section id="features" className="py-24 lg:py-28 bg-surface border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 mb-6">Services</span>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-tight tracking-tight">{title}</h2>
          </ScrollReveal>
          {body && (
            <ScrollReveal delay={0.16}>
              <p className="mt-4 text-base text-slate-500 leading-relaxed">{body}</p>
            </ScrollReveal>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          {featured.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: EASE }}
              whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" as const } }}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100/90 transition-shadow cursor-default"
            >
              <PhotoFrame src={service.photo.src} alt={service.photo.alt} brief={service.photo.alt} tone={service.photo.tone ?? "navy"} motion="parallax" className="h-[200px]">
                <div className={`absolute left-5 bottom-[-22px] w-11 h-11 rounded-xl ${service.iconBg} flex items-center justify-center text-white shadow-md z-[3]`}>
                  {service.icon}
                </div>
              </PhotoFrame>
              <div className="p-7 pt-9 flex flex-col gap-4 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-navy-900">{service.title}</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-200/80 whitespace-nowrap">
                    {service.subtitle}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{service.body}</p>
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-medium text-slate-500 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={`grid sm:grid-cols-2 ${cols} gap-4`}>
          {supporting.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.45, ease: EASE }}
              whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" as const } }}
              className="group bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/80 transition-shadow cursor-default"
            >
              <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center text-navy-700 group-hover:bg-navy-900 group-hover:text-white transition-colors">{service.icon}</div>
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
