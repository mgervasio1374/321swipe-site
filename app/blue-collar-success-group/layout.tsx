import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "321 Swipe for Blue Collar Success Group Members | Payment Intelligence for Contractors",
  description:
    "321 Swipe helps Blue Collar Success Group members review merchant statements, uncover hidden fees, improve payment visibility, and make smarter processing decisions.",
};

export default function BCGLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
