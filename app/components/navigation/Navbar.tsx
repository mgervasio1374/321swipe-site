"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { EASE } from "@/app/lib/animations";

const navLinks = [
  { label: "Platform", href: "#features" },
  { label: "Intelligence", href: "#intelligence" },
  { label: "Contractors", href: "#about" },
  { label: "About", href: "#partnership" },
];

// Inline badge mark — extracted from brand SVG, cropped to icon only
function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="18 13 58 57"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id="nav-clip1">
          <path d="M 20,16 H 74 V 68 H 20 Z" />
        </clipPath>
        <clipPath id="nav-clip2">
          <path d="m 21.695312,62.082031 c 0,1.160157 0.316407,2.09375 0.855469,2.75 0.519531,0.628907 1.261719,1.007813 2.234375,1.007813 h 31.765625 c 0.01563,0 0.03125,0 0.04687,0 1.179688,0 2.472656,-0.628906 3.5625,-1.679688 1.121094,-1.046875 2.011719,-2.527344 2.417969,-4.132812 L 71.625,23.363281 c 0.132812,-0.589843 0.199219,-1.148437 0.199219,-1.675781 0,-1.148438 -0.316407,-2.09375 -0.851563,-2.738281 -0.523437,-0.640625 -1.261718,-1.015625 -2.238281,-1.015625 H 36.972656 c -1.191406,0 -2.496094,0.613281 -3.605468,1.675781 -1.125,1.050781 -2.019532,2.53125 -2.402344,4.132813 L 21.910156,60.40625 C 21.765625,61 21.695312,61.5625 21.695312,62.082031" />
        </clipPath>
        <symbol id="nav-g321-3" overflow="visible">
          <path style={{stroke:"none"}} d="m 4.1875,0.78125 c 4.125,0 8.53125,-5.390625 10.3125,-11.4375 1.328125,-4.5625 0.328125,-8.140625 -1.421875,-8.8125 l 0.03125,-0.09375 c 2.203125,-1.875 4.5,-4.609375 5.703125,-8.703125 0.828125,-3.109375 0.75,-7.09375 -2.234375,-7.09375 -3.09375,0 -5.984375,4.8125 -7.390625,8.390625 C 9.015625,-26.5 8.96875,-26.25 9.078125,-26.1875 l 0.390625,0.296875 c 0.0625,0.0625 0.171875,0 0.484375,-0.609375 1.296875,-2.703125 2.828125,-4.875 4.203125,-4.875 1.53125,0 1.46875,2.640625 0.765625,5.03125 C 13.75,-22.359375 11.890625,-20.140625 9.75,-19.359375 9.359375,-19.203125 9.234375,-19 9.046875,-18.375 c -0.140625,0.515625 -0.140625,0.71875 0.28125,0.984375 2.03125,1.140625 2.25,4.140625 0.890625,8.796875 -1.09375,3.734375 -3.203125,7.140625 -4.953125,7.140625 -1.109375,0 -1.109375,-1.140625 -1.0625,-1.8125 C 4.28125,-4.25 4.359375,-5.953125 3.375,-5.953125 2.796875,-5.90625 1.9375,-4.609375 1.546875,-3.265625 1.125,-1.8125 1.171875,0.78125 4.1875,0.78125 Z" />
        </symbol>
        <symbol id="nav-g321-2" overflow="visible">
          <path style={{stroke:"none"}} d="M 7.671875,0 C 8.65625,0 9.109375,0.046875 9.078125,0.71875 9.046875,1.140625 9.046875,1.25 9.234375,1.25 c 0.21875,0 0.34375,-0.15625 0.53125,-0.578125 l 4.5625,-9.578125 c 0.171875,-0.359375 0.125,-0.5625 -0.0625,-0.828125 -0.171875,-0.25 -0.28125,-0.15625 -0.53125,0.3125 -1.09375,1.921875 -2.328125,3.9375 -3.9375,3.9375 h -4.25 l 0.0625,-0.203125 c 1.203125,-1.515625 2.875,-3.421875 5.109375,-6.21875 4.3125,-5.390625 6.546875,-9.625 7.828125,-14.03125 1.5,-5.125 0.765625,-9.421875 -1.90625,-9.421875 -3.546875,0 -6.59375,5.75 -7.578125,7.765625 -0.234375,0.46875 -0.265625,0.625 -0.21875,0.734375 L 9.171875,-26.5 c 0.0625,0.09375 0.140625,0.09375 0.375,-0.3125 1.078125,-1.859375 2.59375,-3.890625 4.0625,-4.046875 1.671875,-0.09375 2.0625,2.484375 1.015625,6.328125 -1.265625,4.5 -3.421875,8.53125 -6.125,12.578125 -3.203125,4.8125 -6.5,8.90625 -7.890625,10.609375 -0.265625,0.3125 -0.46875,0.875 -0.5,1.234375 -0.03125,0.3125 0.046875,0.3125 0.171875,0.3125 0.09375,0 0.40625,-0.046875 0.796875,-0.09375 C 1.453125,0.046875 1.921875,0 2.34375,0 Z" />
        </symbol>
        <symbol id="nav-g321-1" overflow="visible">
          <path style={{stroke:"none"}} d="M 9.125,-14.5 C 8.578125,-12.625 6.921875,-6.9375 6.234375,-4.765625 5.421875,-2.125 5,-1.96875 3.65625,-1.96875 H 3.015625 c -0.203125,0 -0.359375,0.046875 -0.453125,0.359375 l -0.40625,1.40625 C 2.078125,0.046875 2.09375,0.15625 2.234375,0.15625 2.359375,0.15625 5.875,0 6.59375,0 c 0.421875,0 3.71875,0.15625 3.890625,0.15625 0.203125,0 0.296875,-0.109375 0.375,-0.359375 L 11.25,-1.546875 C 11.328125,-1.8125 11.3125,-1.96875 11.140625,-1.96875 H 10.25 c -1.234375,0 -1.21875,-0.359375 -0.46875,-3.046875 C 9.953125,-5.59375 12.546875,-14.5 13.328125,-17.1875 l 0.640625,-2.171875 c 1.953125,-6.671875 4.390625,-14.8125 4.515625,-15.21875 0.125,-0.421875 0.171875,-0.78125 0.01563,-0.78125 -0.171875,0 -0.34375,0.15625 -0.5625,0.3125 l -7.78125,6.15625 c -0.234375,0.21875 -0.3125,0.421875 -0.328125,0.625 l -0.140625,1.03125 c -0.015625,0.21875 0.09375,0.21875 0.234375,0.15625 l 1.421875,-0.71875 c 0.625,-0.3125 0.96875,-0.359375 1.21875,-0.359375 0.4375,0 0.21875,1.140625 -0.140625,2.375 z" />
        </symbol>
      </defs>
      <g transform="translate(-7.3968749,-12.242928)">
        <path fill="#3570bd" d="M 65.078125,62.25 C 64.101562,66.164062 60.761719,69.34375 57.625,69.34375 H 22.335938 c -3.140626,0 -4.902344,-3.179688 -3.941407,-7.09375 L 28.445312,21.527344 c 0.972657,-3.921875 4.300782,-7.097656 7.457032,-7.097656 H 71.1875 c 3.140625,0 4.902344,3.175781 3.949219,7.097656 Z"/>
        <path fill="#ffffff" d="M 65.078125,62.25 64.40625,62.066406 c -0.453125,1.789063 -1.441406,3.449219 -2.707031,4.640625 -1.238281,1.191407 -2.710938,1.875 -4.074219,1.875 H 22.335938 c -1.097657,0 -1.929688,-0.433593 -2.535157,-1.15625 -0.605469,-0.71875 -0.972656,-1.789062 -0.972656,-3.082031 0,-0.601562 0.08594,-1.230469 0.25,-1.902344 L 29.117188,21.710938 c 0.453124,-1.792969 1.460937,-3.453126 2.699218,-4.644532 C 33.0625,15.871094 34.542969,15.1875 35.902344,15.1875 H 71.1875 c 1.089844,0 1.933594,0.433594 2.539062,1.15625 0.601563,0.738281 0.972657,1.789062 0.972657,3.089844 0,0.59375 -0.08984,1.226562 -0.234375,1.894531 Z"/>
        <path fill="#3a7dc7" d="m 65.140625,61.953125 c -0.972656,3.90625 -4.273437,7.066406 -7.402344,7.066406 H 22.667969 c -3.140625,0 -4.882813,-3.160156 -3.921875,-7.066406 l 9.984375,-40.480469 c 0.957031,-3.882812 4.28125,-7.042968 7.40625,-7.042968 h 35.074219 c 3.117187,0 4.878906,3.160156 3.925781,7.042968 Z"/>
        <g clipPath="url(#nav-clip1)">
          <g clipPath="url(#nav-clip2)">
            <rect x="19.49" y="15.39" width="54.84" height="52.69" fill="#3a7dc7"/>
          </g>
        </g>
        <g fill="#ffffff">
          <use xlinkHref="#nav-g321-3" x="25.0324" y="58.270302"/>
          <use xlinkHref="#nav-g321-2" x="37.335133" y="58.270302"/>
          <use xlinkHref="#nav-g321-1" x="49.637081" y="58.270302"/>
        </g>
      </g>
    </svg>
  );
}

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
          : "bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm bg-shimmer",
      ].join(" ")}
      style={
        scrolled
          ? { borderBottom: "1px solid rgba(15,23,42,0.07)", boxShadow: "0 1px 20px rgba(12,21,36,0.05), 0 1px 4px rgba(12,21,36,0.04)" }
          : {
              borderBottom: "1px solid rgba(15,23,42,0.04)",
              backgroundImage: "radial-gradient(circle at 20% 24%, rgba(37,99,235,0.14), transparent 22%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.08), transparent 26%)",
            }
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
            <Image
              src="/logo-dark.svg"
              alt="321 Swipe"
              width={118}
              height={47}
              style={{ height: "auto" }}
              priority
            />
          </motion.a>

          {/* Desktop nav — with animated hover indicator */}
          <nav className="hidden md:flex items-center gap-0 flex-1 justify-center">
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
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => (window as any).Tawk_API?.maximize?.()}
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
            className="md:hidden p-2 rounded-md text-navy-900 hover:bg-navy-50 transition-colors"
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
            className="md:hidden overflow-hidden border-t border-slate-100 bg-white/96 backdrop-blur-lg"
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
                <Button variant="secondary" onClick={() => { setMobileOpen(false); (window as any).Tawk_API?.maximize?.(); }}>Talk to 321 Swipe</Button>
                <Button variant="primary" href="https://upload.321swipe.com">Request a Review</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
