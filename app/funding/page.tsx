import type { Metadata } from "next";
import { loadPhotos } from "@/app/lib/photos";
import { FundingPage } from "./FundingPage";

export const metadata: Metadata = {
  title: "On Demand Funding & Customer Financing | 321 Swipe",
  description:
    "Move today's card batch into your bank account in minutes, any day of the week, for a flat 1.5% — no loan, no monthly fee. Plus point-of-sale financing so customers can pay over time. How it works and how 321 Swipe merchants enroll.",
  alternates: { canonical: "https://321swipe.com/funding" },
  openGraph: {
    title: "Your batch, in your account, in minutes.",
    description: "On Demand Funding for 321 Swipe merchants: flat 1.5%, up to $50,000 a day, weekends and holidays included. Plus customer financing from $300 to $25,000.",
    url: "https://321swipe.com/funding",
  },
};

export default function Page() {
  return <FundingPage photos={loadPhotos()} />;
}
