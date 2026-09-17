"use client";

import Image from "next/image";
import Link from "next/link";

const footerColumns = [
  {
    heading: "Company",
    links: [
      { label: "Why 321 Swipe", href: "/#about" },
      { label: "Statement review", href: "/#diagnostic" },
      { label: "Statement Decoder", href: "/statement-decoder" },
      { label: "Fee dictionary", href: "/fees" },
      { label: "Merchant advisory", href: "/advisory" },
      { label: "Services", href: "/#features" },
    ],
  },
  {
    heading: "Partners",
    links: [
      { label: "CertainPath", href: "/certainpath" },
      { label: "Blue Collar Success Group", href: "/blue-collar-success-group" },
    ],
  },
  {
    heading: "Get in touch",
    links: [
      { label: "Request a statement review", href: "https://upload.321swipe.com" },
      { label: "Talk to 321 Swipe", href: "#chat" },
    ],
  },
];

/** Shared dark footer — sits at the bottom of every page's closing section. */
export function SiteFooter() {
  return (
    <footer className="relative border-t border-navy-800/70">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Link href="/" className="w-max">
            <Image
              src="/logo-white.svg"
              alt="321 Swipe"
              width={120}
              height={48}
              className="opacity-80"
              style={{ height: "auto", maxHeight: "32px", width: "auto" }}
            />
          </Link>
          <p className="text-[12.5px] text-navy-100/45 leading-relaxed max-w-[300px]">
            Independent, contractor-first payment intelligence for the trades.
          </p>
          {/* TODO: Replace with the registered ISO/MSP disclosure once legal language is provided. */}
          <p className="text-[11px] text-navy-100/30 leading-relaxed max-w-[340px]">
            321 Swipe is an independent payment advisory and processing partner for home service
            contractors.
          </p>
        </div>
        {footerColumns.map((col) => (
          <div key={col.heading} className="flex flex-col gap-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white mb-1">{col.heading}</p>
            {col.links.map((link) =>
              link.href === "#chat" ? (
                <button
                  key={link.label}
                  onClick={() => window.Tawk_API?.maximize?.()}
                  className="text-left text-[13px] text-navy-100/60 hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ) : link.href.startsWith("http") ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-navy-100/60 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-navy-100/60 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11.5px] text-navy-100/30">
        <p>© {new Date().getFullYear()} 321 Swipe. All rights reserved.</p>
        {/* TODO: point these at real pages once Privacy and Terms copy exists. */}
        <div className="flex gap-5">
          <a href="#" className="hover:text-navy-100/60 transition-colors">Privacy</a>
          <a href="#" className="hover:text-navy-100/60 transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
