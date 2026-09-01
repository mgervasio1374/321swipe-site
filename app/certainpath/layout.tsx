import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "321 Swipe for CertainPath Members | Integrated Payment Intelligence for Contractors",
  description:
    "321 Swipe helps CertainPath members review merchant statements, uncover hidden fees, improve payment visibility, and support software-connected payment workflows.",
};

export default function CertainPathLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
