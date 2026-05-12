"use client";

import { motion } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy-900 text-white px-5 py-2.5 hover:bg-navy-800 active:scale-[0.98]",
  secondary:
    "bg-white text-navy-900 px-5 py-2.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]",
  ghost:
    "text-slate-600 px-4 py-2 hover:text-navy-900 hover:bg-navy-50",
};

export function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={classes}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
