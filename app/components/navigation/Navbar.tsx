"use client";

import { openChat } from "@/app/lib/chat";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { EASE } from "@/app/lib/animations";

const navLinks = [
  { label: "Why 321 Swipe", href: "#about" },
  { label: "Statement Review", href: "#diagnostic" },
  { label: "Verian Intelligence", href: "#intelligence" },
  { label: "Services", href: "#features" },
  { label: "Advisory", href: "#advisory" },
  { label: "Decoder", href: "/statement-decoder" },
  { label: "Software", href: "/software" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/95 backdrop-blur-xl"
          : "bg-white/75 backdrop-blur-md",
      ].join(" ")}
      style={
        scrolled
          ? { borderBottom: "1px solid rgba(15,23,42,0.07)", boxShadow: "0 1px 20px rgba(12,21,36,0.05), 0 1px 4px rgba(12,21,36,0.04)" }
          : { borderBottom: "1px solid rgba(15,23,42,0.05)" }
      }
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-[60px] items-center justify-between gap-8">

          {/* Logo — uses actual brand SVG file for reliable rendering */}
          <motion.a
            href="/"
            className="shrink-0"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* TODO: Replace logo-dark.svg with a higher-resolution/optimised asset when available */}
            <Image
              src="/logo-dark.svg"
              alt="321 Swipe"
              width={128}
              height={51}
              style={{ height: "auto", maxHeight: "36px", width: "auto" }}
              priority
            />
          </motion.a>

          {/* Desktop nav — with animated hover indicator */}
          <nav className="hidden lg:flex items-center gap-0 flex-1 justify-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group relative px-4 py-2 text-[13.5px] font-medium text-slate-500 hover:text-navy-900 transition-colors duration-150"
              >
                {link.label}
                {/* Slide-in accent dot on hover */}
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] rounded-full bg-accent-500 group-hover:w-3 transition-all duration-200 ease-out" />
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              onClick={() => openChat()}
              className="text-[13.5px] font-medium text-slate-500 hover:text-navy-900 px-3 py-2 transition-colors duration-150"
            >
              Talk to 321 Swipe
            </button>
            <motion.a
              href="https://upload.321swipe.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="text-[13.5px] font-semibold text-white px-4 py-2 rounded-lg transition-colors duration-150"
              style={{
                background: "linear-gradient(135deg, #0c1524 0%, #132040 100%)",
                boxShadow: "0 1px 4px rgba(12,21,36,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              Request a Review
            </motion.a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="lg:hidden p-2 rounded-md text-navy-900 hover:bg-navy-50 transition-colors"
          >
            <div className="flex flex-col gap-[5px] w-5">
              <span className={["block h-[1.5px] w-full bg-current transition-all duration-200", mobileOpen ? "translate-y-[6.5px] rotate-45" : ""].join(" ")} />
              <span className={["block h-[1.5px] w-full bg-current transition-all duration-200", mobileOpen ? "opacity-0" : ""].join(" ")} />
              <span className={["block h-[1.5px] w-full bg-current transition-all duration-200", mobileOpen ? "-translate-y-[6.5px] -rotate-45" : ""].join(" ")} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="lg:hidden overflow-hidden border-t border-slate-100 bg-white/96 backdrop-blur-lg"
          >
            <div className="px-6 pb-6 pt-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-slate-600 hover:text-navy-900 font-medium text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-2 border-t border-slate-100 mt-2">
                <Button variant="secondary" onClick={() => { setMobileOpen(false); openChat(); }}>Talk to 321 Swipe</Button>
                <Button variant="primary" href="https://upload.321swipe.com">Request a Review</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
