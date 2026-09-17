import type { Metadata } from "next";
import { loadPhotos } from "@/app/lib/photos";
import { StatementDecoderPage } from "./StatementDecoderPage";

export const metadata: Metadata = {
  title: "Statement Decoder | 321 Swipe — Every Processor Fee, Explained Line by Line",
  description:
    "An interactive credit card processing statement for a home-service contractor. Hover any line to learn what the fee is, what a fair version looks like, and which fees you can get rid of.",
  alternates: { canonical: "https://321swipe.com/statement-decoder" },
};

export default function Page() {
  return <StatementDecoderPage photos={loadPhotos()} />;
}
