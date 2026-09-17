/**
 * Statement Decoder data — single source of truth for /statement-decoder and
 * the /fees/<slug> dictionary pages.
 *
 * DRAFT — every "typicalRange" and every sample amount needs Bruce's sign-off
 * before launch. Numbers are chosen to be realistic for a home-service
 * contractor on a tiered plan, not to describe any specific processor.
 */

export type Verdict = "pass-through" | "markup" | "avoidable";
export type FeeGroup = "interchange" | "processor" | "monthly" | "downgrades" | "contract";

export interface Fee {
  /** URL slug for /fees/<slug>. */
  slug: string;
  /** Plain name used in headings. */
  label: string;
  /** How it's printed on the sample statement (processor shorthand). */
  statementLabel: string;
  group: FeeGroup;
  /** Dollar amount on the sample statement. null = shown as a note, not a charge. */
  sampleAmount: number | null;
  /** How the sample amount was computed, e.g. "0.40% × $82,000.00". */
  sampleDetail?: string;
  verdict: Verdict;
  /** 2–3 sentences, plain English. */
  plainEnglish: string;
  /** What a fair version looks like for a contractor doing ~$50k–$150k/month. */
  typicalRange: string;
  /** One sentence: what 321 Swipe does about it. */
  whatWeDo: string;
  related: string[];
}

export const GROUPS: { id: FeeGroup; title: string; blurb: string }[] = [
  { id: "interchange", title: "Interchange & assessments", blurb: "Paid to the card brands and issuing banks. Real cost — no processor can waive it." },
  { id: "processor", title: "Processor fees", blurb: "The processor's own margin. This is the part that is negotiable." },
  { id: "monthly", title: "Monthly & miscellaneous", blurb: "Flat fees that show up every month whether you run a card or not." },
  { id: "downgrades", title: "Downgrades & surcharges", blurb: "Transactions that were charged a higher tier than they should have been." },
  { id: "contract", title: "Contract terms", blurb: "Not charges this month — but they decide what leaving costs you." },
];

export const VERDICTS: Record<Verdict, { label: string; short: string; color: string; bg: string; ring: string; blurb: string }> = {
  "pass-through": {
    label: "Pass-through",
    short: "Pass-through",
    color: "#15803d",
    bg: "#f0fdf4",
    ring: "rgba(21,128,61,0.25)",
    blurb: "Real cost paid to the card networks. The same on every processor.",
  },
  markup: {
    label: "Processor markup",
    short: "Markup",
    color: "#b45309",
    bg: "#fffbeb",
    ring: "rgba(180,83,9,0.28)",
    blurb: "The processor's margin. Legitimate — but negotiable.",
  },
  avoidable: {
    label: "Avoidable",
    short: "Avoidable",
    color: "#b91c1c",
    bg: "#fef2f2",
    ring: "rgba(185,28,28,0.28)",
    blurb: "Junk fees, penalties and downgrades you should not be paying.",
  },
};

/** The fictional business used across the site. */
export const SAMPLE = {
  business: "Apex Roofing LLC",
  address: "1180 Industrial Pkwy, Ste 4 · Dayton, OH 45404",
  merchantId: "4412 0087 3391",
  period: "August 1 – 31, 2026",
  statementDate: "September 3, 2026",
  volume: 82_000,
  salesCount: 186,
  refunds: 1_240,
  refundCount: 3,
  cards: [
    { brand: "Visa", amount: 41_820, count: 96 },
    { brand: "Mastercard", amount: 24_600, count: 58 },
    { brand: "Discover", amount: 6_560, count: 14 },
    { brand: "American Express", amount: 9_020, count: 18 },
  ],
};

export const FEES: Fee[] = [
  // ── Interchange & assessments ───────────────────────────────────────────────
  {
    slug: "visa-interchange",
    label: "Visa interchange",
    statementLabel: "VISA INTERCHANGE",
    group: "interchange",
    sampleAmount: 783.27,
    sampleDetail: "96 items · $41,820.00",
    verdict: "pass-through",
    plainEnglish:
      "Interchange is what the customer's bank charges every time one of its cards is used. Visa sets the rates, publishes them twice a year, and every processor in the country pays exactly the same amount. It is the single largest line on any statement and it is not negotiable.",
    typicalRange:
      "Roughly 1.5%–2.4% of Visa volume for a home-service business, depending on how many rewards and business cards your customers use and whether transactions are tapped, keyed or invoiced.",
    whatWeDo:
      "We can't lower interchange, but we make sure you qualify for the lowest category each transaction is eligible for — that's where downgrades hide.",
    related: ["dues-and-assessments", "non-qualified-surcharge", "mid-qualified-surcharge"],
  },
  {
    slug: "mastercard-interchange",
    label: "Mastercard interchange",
    statementLabel: "MASTERCARD INTERCHANGE",
    group: "interchange",
    sampleAmount: 473.2,
    sampleDetail: "58 items · $24,600.00",
    verdict: "pass-through",
    plainEnglish:
      "Same idea as Visa interchange: the fee set by Mastercard and paid to the bank that issued the customer's card. Rates vary by card type (debit, consumer credit, rewards, business) and by how the card was accepted. Your processor passes it through at cost.",
    typicalRange: "Roughly 1.5%–2.5% of Mastercard volume, with debit well below that and premium business cards well above.",
    whatWeDo:
      "We check that your Mastercard transactions are settling in the right category — business cards and keyed transactions are the usual trouble spots.",
    related: ["visa-interchange", "dues-and-assessments"],
  },
  {
    slug: "discover-interchange",
    label: "Discover interchange",
    statementLabel: "DISCOVER INTERCHANGE",
    group: "interchange",
    sampleAmount: 124.07,
    sampleDetail: "14 items · $6,560.00",
    verdict: "pass-through",
    plainEnglish:
      "Discover's version of interchange. Discover is a smaller share of most contractors' volume, but the rates are in the same neighborhood as Visa and Mastercard and are passed through at cost.",
    typicalRange: "Roughly 1.6%–2.4% of Discover volume.",
    whatWeDo: "Nothing to negotiate here — we simply confirm it's being passed through, not padded.",
    related: ["visa-interchange", "amex-optblue"],
  },
  {
    slug: "amex-optblue",
    label: "American Express OptBlue",
    statementLabel: "AMEX OPTBLUE PROGRAM",
    group: "interchange",
    sampleAmount: 209.26,
    sampleDetail: "18 items · $9,020.00",
    verdict: "pass-through",
    plainEnglish:
      "OptBlue is how most small businesses accept American Express: your processor sets one combined rate that includes Amex's wholesale cost plus the processor's markup. Amex is more expensive than Visa or Mastercard, and on many statements the processor's margin on Amex is higher than on the other brands.",
    typicalRange:
      "Amex's wholesale cost is roughly 1.6%–2.3% plus $0.10 for most home-service tickets; a fair OptBlue rate sits a few tenths above that. Above 3% is worth a conversation.",
    whatWeDo: "We split the Amex line into wholesale cost and markup so you can see what you're actually paying for the privilege.",
    related: ["discount-rate-markup", "visa-interchange"],
  },
  {
    slug: "dues-and-assessments",
    label: "Dues & assessments",
    statementLabel: "DUES & ASSESSMENTS",
    group: "interchange",
    sampleAmount: 101.52,
    sampleDetail: "0.13%–0.14% of brand volume",
    verdict: "pass-through",
    plainEnglish:
      "A small percentage the card brands themselves (Visa, Mastercard, Discover) charge on every transaction, separate from the interchange that goes to the issuing bank. It is published, fixed and identical on every processor.",
    typicalRange: "About 0.13%–0.14% of volume per brand. On $82,000 a month that's roughly $100–$115.",
    whatWeDo: "We verify the percentage matches the published rate — a padded assessment line is a classic place to hide a few basis points.",
    related: ["network-fees", "visa-interchange"],
  },
  {
    slug: "network-fees",
    label: "Network access fees",
    statementLabel: "NETWORK ACCESS / APF / NABU",
    group: "interchange",
    sampleAmount: 12.4,
    sampleDetail: "Per-item + monthly brand fees",
    verdict: "pass-through",
    plainEnglish:
      "A handful of small card-brand fees with alphabet-soup names: Visa's Acquirer Processing Fee (APF) and Fixed Acquirer Network Fee (FANF), Mastercard's Network Access and Brand Usage fee (NABU), and similar. They are real, fixed and pennies per transaction.",
    typicalRange: "Under $0.02–$0.03 per transaction plus a few dollars a month. Typically $10–$30 total for a business this size.",
    whatWeDo: "We confirm they're itemized at cost. Some processors bundle these into a bigger 'network fee' with their own margin inside.",
    related: ["dues-and-assessments", "regulatory-product-fee"],
  },

  // ── Processor fees (markup) ─────────────────────────────────────────────────
  {
    slug: "discount-rate-markup",
    label: "Discount rate (processor markup)",
    statementLabel: "DISCOUNT RATE",
    group: "processor",
    sampleAmount: 328.0,
    sampleDetail: "0.40% × $82,000.00",
    verdict: "markup",
    plainEnglish:
      "The percentage the processor adds on top of interchange for handling your transactions. This is the processor's real revenue and the number you are actually negotiating when you 'shop rates'. On interchange-plus pricing it is shown separately; on tiered or flat-rate pricing it is blended into the rate so you can't see it.",
    typicalRange:
      "For a contractor doing $50k–$150k a month, 0.15%–0.35% over interchange is a fair markup. 0.40% and above is worth revisiting; anything you can't see at all is a bigger problem than the number.",
    whatWeDo: "We benchmark your markup against businesses your size and renegotiate it — or move you to a processor that publishes it.",
    related: ["per-item-fee", "authorization-fee", "amex-optblue"],
  },
  {
    slug: "per-item-fee",
    label: "Per-item transaction fee",
    statementLabel: "TRANSACTION FEE",
    group: "processor",
    sampleAmount: 28.35,
    sampleDetail: "189 items × $0.15",
    verdict: "markup",
    plainEnglish:
      "A flat few cents the processor charges on every sale, refund and (sometimes) decline, in addition to the percentage. It matters less for high-ticket work like roofing and more for businesses running hundreds of small transactions.",
    typicalRange: "$0.05–$0.15 per item is normal. Above $0.20, or being charged per item and per authorization on the same transaction, is padding.",
    whatWeDo: "We check for double-dipping between the per-item fee and the authorization fee and negotiate the cents down.",
    related: ["authorization-fee", "discount-rate-markup", "batch-header-fee"],
  },
  {
    slug: "authorization-fee",
    label: "Authorization fee",
    statementLabel: "AUTHORIZATION FEE",
    group: "processor",
    sampleAmount: 20.4,
    sampleDetail: "204 auths × $0.10",
    verdict: "markup",
    plainEnglish:
      "Charged every time a card is checked with the bank, whether or not the sale goes through — so declines, voids and pre-authorizations all count. Legitimate, but it should be small and it should not be stacked on top of a separate per-item fee at the same rate.",
    typicalRange: "$0.05–$0.10 per authorization. Watch the count: if authorizations run far above your sales count, something in your workflow is re-trying cards.",
    whatWeDo: "We reconcile the authorization count against your actual sales and negotiate the fee alongside the per-item fee.",
    related: ["per-item-fee", "discount-rate-markup"],
  },

  // ── Monthly & miscellaneous ────────────────────────────────────────────────
  {
    slug: "statement-fee",
    label: "Statement fee",
    statementLabel: "STATEMENT FEE",
    group: "monthly",
    sampleAmount: 7.95,
    verdict: "markup",
    plainEnglish:
      "A monthly charge for producing the statement you're reading, sometimes called a 'service fee' or 'account fee'. It costs the processor almost nothing to generate a PDF. Small on its own; it adds up with the other flat fees around it.",
    typicalRange: "$0–$10 a month. Many processors have dropped it entirely.",
    whatWeDo: "We ask for it to be waived. It usually is.",
    related: ["pci-compliance-fee", "regulatory-product-fee", "minimum-monthly"],
  },
  {
    slug: "pci-compliance-fee",
    label: "PCI compliance fee",
    statementLabel: "PCI COMPLIANCE PROGRAM",
    group: "monthly",
    sampleAmount: 19.95,
    verdict: "markup",
    plainEnglish:
      "PCI is the card industry's security standard, and processors are required to help merchants stay compliant. This fee is meant to cover that program — an annual questionnaire, sometimes a network scan. It is a real service, but the price varies enormously and it should never be charged alongside a non-compliance penalty in the same month.",
    typicalRange: "$0–$15 a month, or $60–$120 a year. Some processors include it at no charge.",
    whatWeDo: "We make sure you're actually enrolled and compliant (which also removes the non-compliance penalty), then negotiate the program fee down.",
    related: ["pci-non-compliance-fee", "statement-fee"],
  },
  {
    slug: "pci-non-compliance-fee",
    label: "PCI non-compliance fee",
    statementLabel: "PCI NON-COMPLIANCE FEE",
    group: "monthly",
    sampleAmount: 39.95,
    verdict: "avoidable",
    plainEnglish:
      "A monthly penalty for not completing your PCI self-assessment questionnaire — usually because nobody told you it existed, or the email went to a spam folder. It is pure penalty: you get nothing for it, and it is often charged for years. The fix is a questionnaire that takes about twenty minutes.",
    typicalRange: "$0. Ever. If you see it, the account is simply out of compliance and the fee disappears once the questionnaire is filed.",
    whatWeDo: "We walk you through the questionnaire, confirm the processor has recorded it, and check that the fee stops — and ask for a refund of past months where it was never disclosed.",
    related: ["pci-compliance-fee", "regulatory-product-fee"],
  },
  {
    slug: "regulatory-product-fee",
    label: "Regulatory / product fee",
    statementLabel: "REGULATORY PRODUCT FEE",
    group: "monthly",
    sampleAmount: 14.95,
    verdict: "avoidable",
    plainEnglish:
      "A vaguely named monthly charge that sounds like a government requirement and isn't. Names vary — 'regulatory fee', 'product fee', 'compliance fee', 'IRS reporting fee', 'merchant club'. Card-brand and IRS reporting costs are already covered elsewhere on the statement; this is a processor add-on.",
    typicalRange: "$0. The legitimate reporting costs it claims to cover are fractions of a cent per transaction.",
    whatWeDo: "We ask the processor to identify exactly which regulation the fee relates to. When they can't, we have it removed.",
    related: ["pci-non-compliance-fee", "network-fees", "statement-fee"],
  },
  {
    slug: "batch-header-fee",
    label: "Batch header fee",
    statementLabel: "BATCH FEE",
    group: "monthly",
    sampleAmount: 5.5,
    sampleDetail: "22 batches × $0.25",
    verdict: "avoidable",
    plainEnglish:
      "Charged each time your terminal or software 'closes the batch' — sends the day's transactions in for settlement. Twenty years ago that involved a phone line; today it is an automated file. Some processors still charge $0.25–$0.35 per batch, which is a small line that exists mostly because nobody questions it.",
    typicalRange: "$0–$0.10 per batch. Many processors have eliminated it.",
    whatWeDo: "We have it removed, and check that your system isn't batching several times a day for no reason.",
    related: ["per-item-fee", "statement-fee"],
  },
  {
    slug: "gateway-fee",
    label: "Gateway fee",
    statementLabel: "GATEWAY ACCESS",
    group: "monthly",
    sampleAmount: 15.0,
    verdict: "markup",
    plainEnglish:
      "A monthly fee for the software that connects your invoicing tool, website or virtual terminal to the processor. If you send invoices with a 'pay now' link or take cards from the office, you use a gateway. It's a real service — the question is whether you're paying twice (a gateway fee here and a software subscription elsewhere).",
    typicalRange: "$0–$20 a month, plus a few cents per transaction on some gateways. Your field-service software may already include one.",
    whatWeDo: "We map every place a card can enter your business and remove gateways you're paying for but not using.",
    related: ["wireless-fee", "per-item-fee"],
  },
  {
    slug: "wireless-fee",
    label: "Wireless / mobile terminal fee",
    statementLabel: "WIRELESS ACCESS",
    group: "monthly",
    sampleAmount: 12.95,
    verdict: "markup",
    plainEnglish:
      "A monthly charge for a card reader that uses a cellular connection instead of Wi-Fi, common with techs and crews taking payment at the job site. Legitimate if you have a cellular device; not if your readers pair to a phone that already has a data plan.",
    typicalRange: "$0–$15 per device per month, only for devices with their own SIM. $0 for Bluetooth readers.",
    whatWeDo: "We inventory your devices and cancel wireless fees for readers that don't need them.",
    related: ["gateway-fee", "equipment-lease"],
  },
  {
    slug: "minimum-monthly",
    label: "Monthly minimum",
    statementLabel: "MONTHLY MINIMUM ADJ.",
    group: "monthly",
    sampleAmount: 0,
    sampleDetail: "Minimum met",
    verdict: "markup",
    plainEnglish:
      "A floor on the processor's fees: if your markup for the month comes in under (say) $25, they charge the difference. Irrelevant in a busy month, painful in a slow winter or if you keep a second account you barely use. Read the fine print — some minimums count only the processor's markup, so you can be charged one even in a month with sales.",
    typicalRange: "$0–$25 a month, and it should be waived once your volume is established.",
    whatWeDo: "We negotiate it out, and close 'backup' accounts that exist only to generate minimums.",
    related: ["statement-fee", "annual-fee"],
  },

  // ── Downgrades & surcharges ────────────────────────────────────────────────
  {
    slug: "non-qualified-surcharge",
    label: "Non-qualified surcharge",
    statementLabel: "NON-QUAL SURCHARGE",
    group: "downgrades",
    sampleAmount: 312.4,
    sampleDetail: "1.90% × $16,442.00",
    verdict: "avoidable",
    plainEnglish:
      "On tiered pricing, every transaction is sorted into 'qualified', 'mid-qualified' or 'non-qualified' buckets, and the processor decides the rules. Rewards cards, business cards and keyed-in transactions typically land in 'non-qualified' and get hit with an extra 1%–2% on top of the advertised rate. The advertised rate applies to a shrinking share of your sales; this line is where the real cost lives.",
    typicalRange:
      "$0 on interchange-plus pricing, where there are no tiers — you pay the actual interchange for each card plus one fixed markup. On tiered plans, 20%–40% of a contractor's volume can land here.",
    whatWeDo: "We move you off tiered pricing. On a statement like this one, that single change is worth more than every other line combined.",
    related: ["mid-qualified-surcharge", "discount-rate-markup", "visa-interchange"],
  },
  {
    slug: "mid-qualified-surcharge",
    label: "Mid-qualified surcharge",
    statementLabel: "MID-QUAL SURCHARGE",
    group: "downgrades",
    sampleAmount: 77.52,
    sampleDetail: "0.85% × $9,120.00",
    verdict: "markup",
    plainEnglish:
      "The middle tier on a tiered plan: transactions that didn't meet the processor's 'qualified' rules but weren't pushed all the way to non-qualified. Often rewards cards that were tapped or dipped. Part of this reflects genuinely higher interchange on rewards cards; the rest is processor margin dressed up as a card-type difference.",
    typicalRange: "$0 on interchange-plus. If you're on tiers, mid-qual plus non-qual together should be a small fraction of volume, not a quarter of it.",
    whatWeDo: "Same fix as non-qualified: interchange-plus pricing makes the tiers disappear and shows you the true cost of each card.",
    related: ["non-qualified-surcharge", "discount-rate-markup"],
  },

  // ── Contract terms (notes, not charges) ────────────────────────────────────
  {
    slug: "early-termination-fee",
    label: "Early termination fee",
    statementLabel: "EARLY TERMINATION: $495.00 OR LIQUIDATED DAMAGES",
    group: "contract",
    sampleAmount: null,
    verdict: "avoidable",
    plainEnglish:
      "What it costs to leave before the contract ends. A flat $295–$595 is the mild version. 'Liquidated damages' is the aggressive one: the processor estimates the profit it would have made over the remaining months and bills you for it — sometimes thousands of dollars. It is the main reason contractors stay on bad pricing.",
    typicalRange: "$0. Month-to-month agreements with no termination fee are standard for a business with a track record. 321 Swipe's own agreements are month-to-month.",
    whatWeDo: "We read the agreement before you switch, calculate the real exit cost, and often get it reduced or offset — the savings usually cover it within a few months.",
    related: ["auto-renewal", "equipment-lease"],
  },
  {
    slug: "auto-renewal",
    label: "Auto-renewal clause",
    statementLabel: "TERM: 36 MO · AUTO-RENEWS 12 MO · 90-DAY WRITTEN NOTICE",
    group: "contract",
    sampleAmount: null,
    verdict: "avoidable",
    plainEnglish:
      "The three-year agreement quietly becomes another one-year agreement unless you cancel in writing during a narrow window — commonly 30 to 90 days before the term ends. Miss the window and the termination fee applies for another year. Most owners never see the window because the date isn't printed anywhere they'd look.",
    typicalRange: "No auto-renewal, or renewal to month-to-month. Any renewal that re-triggers a termination fee is a red flag.",
    whatWeDo: "We put the notice date on a calendar the day we review the statement, and send the cancellation notice on your behalf when it's time.",
    related: ["early-termination-fee", "annual-fee"],
  },
  {
    slug: "equipment-lease",
    label: "Terminal lease",
    statementLabel: "TERMINAL LEASE: $39.95/MO × 48 MO · BILLED SEPARATELY",
    group: "contract",
    sampleAmount: null,
    verdict: "avoidable",
    plainEnglish:
      "A separate, non-cancellable lease for a card terminal, usually billed by a leasing company rather than the processor so it never appears on this statement. $39.95 a month for 48 months is $1,918 for a device that costs $250–$400 to buy — and the lease survives even if you switch processors.",
    typicalRange: "$0. Buy the equipment outright; a good countertop or mobile terminal is a few hundred dollars.",
    whatWeDo: "We check your bank statements for leasing-company debits, since they never show up here, and help you buy out or run out the lease.",
    related: ["wireless-fee", "early-termination-fee"],
  },
  {
    slug: "annual-fee",
    label: "Annual fee",
    statementLabel: "ANNUAL FEE: $99.00 · BILLED IN JANUARY",
    group: "contract",
    sampleAmount: null,
    verdict: "avoidable",
    plainEnglish:
      "A once-a-year charge, often billed in January or on your anniversary month, for nothing in particular — it is sometimes labeled a 'membership' or 'account maintenance' fee. Because it only shows up once, it is easy to miss when comparing monthly statements.",
    typicalRange: "$0. There is no annual cost to the processor that this covers.",
    whatWeDo: "We look at twelve months of statements, not one, so once-a-year fees can't hide — and we have them removed.",
    related: ["minimum-monthly", "statement-fee", "auto-renewal"],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export const feeBySlug = (slug: string) => FEES.find((f) => f.slug === slug);

export const feesInGroup = (group: FeeGroup) => FEES.filter((f) => f.group === group);

export const sumBy = (pred: (f: Fee) => boolean) =>
  FEES.reduce((acc, f) => acc + (pred(f) && f.sampleAmount ? f.sampleAmount : 0), 0);

export const TOTALS = (() => {
  const passThrough = sumBy((f) => f.verdict === "pass-through");
  const markup = sumBy((f) => f.verdict === "markup");
  const avoidable = sumBy((f) => f.verdict === "avoidable");
  const total = passThrough + markup + avoidable;
  return {
    passThrough,
    markup,
    avoidable,
    flagged: markup + avoidable,
    total,
    effectiveRate: total / SAMPLE.volume,
    annualAvoidable: avoidable * 12,
  };
})();

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
