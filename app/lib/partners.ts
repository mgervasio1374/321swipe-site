import type { SAMPLE } from "@/app/lib/fees";

/** Per-partner flavor for the Statement Decoder (/<partner>/statement-decoder). */
export interface DecoderVariant {
  key: string;
  /** Partner display name. */
  name: string;
  /** Route of the partner page, for the breadcrumb and header link. */
  home: string;
  logo?: { src: string; alt: string };
  headerLabel: string;
  badge: string;
  /** "a heating & air company" — used in sentences. */
  tradePhrase: string;
  sample: Partial<typeof SAMPLE>;
  cta: { label: string; href: string };
  closing: { badge: string; title: string; body: string };
}

export const PARTNER_DECODERS: Record<string, DecoderVariant> = {
  certainpath: {
    key: "certainpath",
    name: "CertainPath",
    home: "/certainpath",
    logo: { src: "/certainpath-logo.svg", alt: "CertainPath" },
    headerLabel: "Statement Decoder · CertainPath members",
    badge: "For CertainPath members",
    tradePhrase: "a heating & air company",
    sample: {
      business: "Summit Heating & Air",
      address: "2210 Refugee Rd · Columbus, OH 43207",
      merchantId: "4412 0087 5520",
    },
    cta: { label: "Request my free member review", href: "https://app.321swipe.com?partner=certainpath" },
    closing: {
      badge: "Free for CertainPath members",
      title: "Now decode yours.",
      body: "As a CertainPath member, send one recent statement and get it back marked up like the one above — with member pricing already applied to the numbers.",
    },
  },
  "blue-collar-success-group": {
    key: "blue-collar-success-group",
    name: "Blue Collar Success Group",
    home: "/blue-collar-success-group",
    headerLabel: "Statement Decoder · Blue Collar Success Group members",
    badge: "For Blue Collar Success Group members",
    tradePhrase: "a plumbing company",
    sample: {
      business: "FlowRight Plumbing",
      address: "4480 Blue Mound Rd · Fort Worth, TX 76106",
      merchantId: "4412 0087 7714",
    },
    cta: { label: "Request my free member review", href: "https://app.321swipe.com?partner=bcsg" },
    closing: {
      badge: "Free for Blue Collar Success Group members",
      title: "Now decode yours.",
      body: "Members: send one statement and we'll return it marked up like the one above, with the group pricing already worked into the totals.",
    },
  },
};
