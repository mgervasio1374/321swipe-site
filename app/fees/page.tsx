import type { Metadata } from "next";
import { loadPhotos } from "@/app/lib/photos";
import { FeeIndexPage } from "./FeeIndexPage";

export const metadata: Metadata = {
  title: "Credit Card Processing Fees, Explained | 321 Swipe Fee Dictionary",
  description:
    "Plain-English definitions of every fee on a merchant processing statement — interchange, assessments, PCI fees, batch fees, downgrades and contract terms — with what a fair version looks like for a home-service contractor.",
  alternates: { canonical: "https://321swipe.com/fees" },
};

export default function Page() {
  return <FeeIndexPage photos={loadPhotos()} />;
}
