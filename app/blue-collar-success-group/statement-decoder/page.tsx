import type { Metadata } from "next";
import { loadPhotos } from "@/app/lib/photos";
import { PARTNER_DECODERS } from "@/app/lib/partners";
import { StatementDecoderPage } from "@/app/statement-decoder/StatementDecoderPage";

const v = PARTNER_DECODERS["blue-collar-success-group"];

export const metadata: Metadata = {
  title: "Statement Decoder for Blue Collar Success Group Members | 321 Swipe",
  description: "An interactive processing statement for a plumbing company, explained line by line. See what 321 Swipe would flag — then send yours for a free member review.",
  alternates: { canonical: "https://321swipe.com/blue-collar-success-group/statement-decoder" },
};

export default function Page() {
  return <StatementDecoderPage photos={loadPhotos()} variant={v} />;
}
