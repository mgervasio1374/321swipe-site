import type { Metadata } from "next";
import { loadPhotos, loadSoftwareShots } from "@/app/lib/photos";
import { SOFTWARE } from "@/app/lib/software";
import { SoftwarePage } from "./SoftwarePage";

export const metadata: Metadata = {
  title: "Software | 321 Swipe — Tools We Built for a Modern Payments Company",
  description:
    "The Statement Decoder, fee dictionary, statement report card, savings calculators, upload portal and the analysis tools behind 321 Swipe's monthly reviews — open any of them.",
  alternates: { canonical: "https://321swipe.com/software" },
};

export default function Page() {
  return <SoftwarePage photos={loadPhotos()} shots={loadSoftwareShots(SOFTWARE.map((s) => s.slug))} />;
}
