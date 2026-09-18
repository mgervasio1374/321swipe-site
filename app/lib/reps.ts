import type { PhotoName } from "@/app/lib/photos";

/**
 * Rep pages (e.g. /savingsbycaryn) are rendered from one of these configs by
 * `components/rep/RepPage`. To add a rep:
 *   1. add a config here,
 *   2. add the photo slot names to PHOTO_NAMES in lib/photos.ts,
 *   3. create app/<slug>/page.tsx (see app/savingsbycaryn/page.tsx — 6 lines),
 *   4. drop photos into public/photos/.
 */
export interface RepIndustry {
  photo: PhotoName;
  title: string;
  who: string;
  insight: string;
  alt: string;
  brief: string;
  position?: string;
}

export interface Rep {
  slug: string;
  /** Page/brand name, e.g. "Savings by Caryn". */
  pageName: string;
  firstName: string;
  fullName: string;
  initials: string;
  title: string;
  email: string;
  /** Short territory line used in the badge and contact card. */
  territory: string;
  territoryLong: string;
  /** Tag appended to the secure upload portal link (?rep=…). */
  portalTag: string;
  /** Optional headshot in public/photos (1:1). Falls back to initials. */
  headshot?: PhotoName;
  hero: {
    photo: PhotoName;
    lines: [string, string, string];
    body: string;
    alt: string;
    brief: string;
    position?: string;
  };
  who: {
    headline: string;
    accent: string;
    body: string;
  };
  industries: RepIndustry[];
  /** Example review card in the hero. */
  example: {
    business: string;
    lines: { label: string; amount: string; flag: boolean }[];
    before: string;
    after: string;
    saving: string;
  };
  metadata: { title: string; description: string; ogDescription: string };
}

export const CARYN: Rep = {
  slug: "savingsbycaryn",
  pageName: "Savings by Caryn",
  firstName: "Caryn",
  fullName: "Caryn Hales",
  initials: "CH",
  title: "Payment advisor, 321 Swipe",
  email: "savingsbycaryn@gmail.com",
  territory: "Lancaster County & central PA",
  territoryLong: "Lancaster County & central Pennsylvania",
  portalTag: "caryn",
  hero: {
    photo: "caryn-hero",
    lines: ["Meet Caryn.", "Card fees, decoded.", "Neighbor to neighbor."],
    body: "Caryn Hales works with the businesses that keep this part of Pennsylvania running — farm markets, shed builders, hydraulic shops, bakeries, ministries. She reads your processor statement with you, line by line, and tells you plainly what's fair and what isn't.",
    alt: "A produce stand owner taking a card payment from a customer on a summer morning",
    brief: "Lancaster County roadside produce stand, a woman in her 40s in a plain dress and apron tapping a customer's card on a handheld reader, crates of peaches and sweet corn, farmland and a white barn behind. Warm morning light.",
    position: "55% 40%",
  },
  who: {
    headline: "Not just contractors.",
    accent: "Every kind of local business.",
    body: "321 Swipe started with the trades. Caryn's customers are the rest of Main Street and the back roads — from produce auctions to hydraulic shops to mutual-aid societies. Each one pays for cards a little differently, and each one has a different place where the money leaks.",
  },
  industries: [
    {
      photo: "caryn-farm-market",
      title: "Farm markets, greenhouses & produce auctions",
      who: "Fruit farms, greenhouses, mulch yards, produce auctions, jersey dairies",
      insight: "Volume that arrives in one season and a checkout that has to be fast. Caryn watches for tiered plans that punish rewards cards at the register and for minimums that bite in January.",
      alt: "A farm market checkout with baskets of produce and a customer tapping a card",
      brief: "Farm market stand under a wooden roof, crates of tomatoes and sweet corn, a woman in an apron holding out a card reader to a customer. Bright summer morning.",
      position: "50% 45%",
    },
    {
      photo: "caryn-sheds",
      title: "Sheds, structures & outdoor living",
      who: "Shed builders, storage buildings, structural movers, patio and outdoor-living retailers",
      insight: "Big tickets, deposits and balances. A $9,000 shed on a card can trigger large-ticket interchange and surcharge rules most processors never mention. Caryn sets those up right.",
      alt: "A row of finished wooden sheds on a display lot with a salesman and a couple",
      brief: "Display lot of Amish-built sheds in a row, a salesman with a tablet walking a couple past a red-roofed model. Late afternoon, Lancaster County farmland behind.",
      position: "50% 55%",
    },
    {
      photo: "caryn-machine-shop",
      title: "Machine, hydraulic & metal shops",
      who: "Hydraulics, welding and fabrication, steel supply, machine shops, manufacturers",
      insight: "Business-to-business cards, invoices paid over the phone, parts counters. Level II and III data can knock a full percentage point off commercial-card transactions — if the system sends it.",
      alt: "A hydraulic shop parts counter with a technician taking a phone order",
      brief: "Parts counter in a hydraulic repair shop, hoses and fittings on the wall, a technician in a work shirt keying a card payment into a terminal while on the phone. Fluorescent light, clean and busy.",
    },
    {
      photo: "caryn-equipment",
      title: "Auto, truck, trailer & equipment",
      who: "Repair garages, used-car lots, trailer dealers, tractor and equipment sales, rental yards",
      insight: "Repair orders one day, a $14,000 trailer the next. Caryn looks at the mix of small and large tickets so the pricing fits both, and makes sure deposits and rentals settle cleanly.",
      alt: "A trailer and equipment dealer's lot with a customer settling up at the service window",
      brief: "Trailer dealership lot with utility trailers and a compact tractor, a customer at the service window handing over a card. Overcast sky, gravel lot.",
    },
    {
      photo: "caryn-country-store",
      title: "Restaurants, bakeries & country stores",
      who: "Bakeries, grills, soft pretzels, dry goods, groceries, fabric and gift shops, bookstores",
      insight: "Lots of small tickets, so the per-item fees matter more than the rate. Caryn checks batch, statement and PCI charges — the flat fees that quietly eat a small store's margin.",
      alt: "A country store counter with baked goods and a customer paying by card",
      brief: "Country store counter with a glass case of whoopie pies and shoofly pie, a young cashier in a head covering handing a receipt to a customer. Warm wood, morning light through the front window.",
    },
    {
      photo: "caryn-ministry",
      title: "Ministries, nonprofits & mutual aid",
      who: "Ministries, publishers, mutual-aid societies, schools and community organizations",
      insight: "Donations, tuition and event payments deserve nonprofit interchange rates and clear reporting. Caryn makes sure the account is coded correctly — a common miss that costs ministries every month.",
      alt: "Volunteers at a ministry office table processing donations",
      brief: "Two volunteers at a folding table in a plain church fellowship hall, a laptop and a small card reader between them, sorting envelopes. Soft window light, simple and calm.",
    },
  ],
  example: {
    business: "Farm market · 2 stands + online",
    lines: [
      { label: "Non-qualified surcharge", amount: "$186.20", flag: true },
      { label: "PCI non-compliance fee", amount: "$39.95", flag: true },
      { label: "Batch fee × 26", amount: "$6.50", flag: true },
      { label: "Interchange (pass-through)", amount: "$921.14", flag: false },
    ],
    before: "3.41%",
    after: "2.58%",
    saving: "≈ $3,900 a year",
  },
  metadata: {
    title: "Savings by Caryn | 321 Swipe — Card Processing for Lancaster County Businesses",
    description:
      "Caryn Hales is 321 Swipe's payment advisor for Lancaster County and central Pennsylvania — farm markets, shed builders, machine shops, garages, bakeries and ministries. Send her one statement for a free line-by-line review.",
    ogDescription: "Card fees, decoded. Free statement review for Lancaster County and central PA businesses.",
  },
};

export const REPS: Rep[] = [CARYN];
