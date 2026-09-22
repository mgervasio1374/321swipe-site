import type { Metadata } from "next";
import { loadPhotos } from "@/app/lib/photos";
import { PARTNER_DECODERS } from "@/app/lib/partners";
import { StatementDecoderPage } from "@/app/statement-decoder/StatementDecoderPage";

const v = PARTNER_DECODERS.certainpath;

export const metadata: Metadata = {
  title: "Statement Decoder for CertainPath Members | 321 Swipe",
  description: "An interactive processing statement for a heating & air company, explained line by line. See what 321 Swipe would flag — then send yours for a free CertainPath member review.",
  alternates: { canonical: "https://321swipe.com/statement-decoder" /* partner variant shares the Decoder content; consolidate signals */ },
};

export default function Page() {
  return <StatementDecoderPage photos={loadPhotos()} variant={v} />;
}
