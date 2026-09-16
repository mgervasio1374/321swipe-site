"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { EASE } from "@/app/lib/animations";

interface SubpageHeaderProps {
  /** Small label next to the logo, e.g. "Member Page" or "Merchant Advisory". */
  label: string;
  /** Optional partner logo shown before the label. */
  partnerLogo?: { src: string; alt: string };
  cta: { label: string; onClick: () => void };
}

/** Fixed header for partner and advisory pages — same treatment as the homepage navbar. */
export function SubpageHeader({ label, partnerLogo, cta }: SubpageHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      className={["fixed top-0 inset-x-0 z-50 transition-all duration-500", scrolled ? "bg-white/95 backdrop-blur-xl" : "bg-white/75 backdrop-blur-md"].join(" ")}
      style={
        scrolled
          ? { borderBottom: "1px solid rgba(15,23,42,0.07)", boxShadow: "0 1px 20px rgba(12,21,36,0.05), 0 1px 4px rgba(12,21,36,0.04)" }
          : { borderBottom: "1px solid rgba(15,23,42,0.05)" }
      }
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-[60px] items-center justify-between gap-6">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo-dark.svg"
              alt="321 Swipe"
              width={128}
              height={51}
              style={{ height: "auto", maxHeight: "36px", width: "auto" }}
              priority
            />
          </Link>
          <div className="hidden sm:flex items-center gap-2.5 flex-1">
            {partnerLogo && (
              <Image src={partnerLogo.src} alt={partnerLogo.alt} width={120} height={30} style={{ height: "20px", width: "auto", opacity: 0.75 }} />
            )}
            <span className="w-px h-4 bg-slate-200" />
            <span className="text-[12px] font-medium text-slate-400">{label}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => window.Tawk_API?.maximize?.()}
              className="hidden md:block text-[13.5px] font-medium text-slate-500 hover:text-navy-900 px-3 py-2 transition-colors"
            >
              Talk to 321 Swipe
            </button>
            <motion.button
              onClick={cta.onClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="text-[13.5px] font-semibold text-white px-4 py-2 rounded-lg transition-colors"
              style={{
                background: "linear-gradient(135deg, #0c1524 0%, #132040 100%)",
                boxShadow: "0 1px 4px rgba(12,21,36,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {cta.label}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
