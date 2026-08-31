import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchant Advisory | 321 Swipe — Processor Approval, Underwriting and Limits",
  description:
    "For businesses that are hard to board: high tickets, regulated products, no processing history. 321 Swipe prepares the underwriting file, designs the acceptance program, benchmarks the rate, and manages credit limits after go-live.",
};

export default function AdvisoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
