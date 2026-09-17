/**
 * /software — the portfolio of tools 321 Swipe has built.
 *
 * Each entry renders as a card with a screenshot (public/software/<slug>.jpg),
 * a short description and a link that opens the live tool in a new tab.
 * Entries with status "soon" render without a link until `href` is filled in.
 */
export type SoftwareStatus = "live" | "demo" | "soon";

export interface SoftwareItem {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: "Analysis" | "Education" | "Pricing" | "Operations" | "Platform";
  status: SoftwareStatus;
  /** Live/demo URL. Internal paths open in the same tab; absolute URLs open a new tab. */
  href?: string;
  /** Who it's for, in a few words. */
  audience: string;
  /** Three or four short capability tags. */
  tags: string[];
  /** Optional accent for the card's placeholder frame if no screenshot exists yet. */
  tone?: "navy" | "warm" | "light";
}

export const SOFTWARE: SoftwareItem[] = [
  {
    slug: "statement-decoder",
    name: "Statement Decoder",
    tagline: "Every line on a processor statement, explained.",
    description:
      "An interactive merchant statement for a fictional roofing company. Hover or tap any line for a plain-English explanation, a fair range and what we'd do about it; flip a switch to see every negotiable and avoidable fee light up with a running total.",
    category: "Education",
    status: "live",
    href: "/statement-decoder",
    audience: "Contractors, partners, anyone with a statement",
    tags: ["23 fee explainers", "Flag mode", "Partner variants", "Mobile"],
    tone: "light",
  },
  {
    slug: "grade-my-statement",
    name: "Statement Report Card",
    tagline: "Six questions. A letter grade. A shareable link.",
    description:
      "A two-minute check that scores a business's processing deal from A to F — pricing model, effective rate, contract terms, junk fees, equipment and review cadence — with each finding linked to the fee dictionary. Results encode into the URL, so nothing is stored and any grade can be forwarded to a rep.",
    category: "Analysis",
    status: "live",
    href: "/grade-my-statement",
    audience: "Prospects and partner members",
    tags: ["A–F scoring", "Effective-rate calculator", "Shareable results"],
    tone: "warm",
  },
  {
    slug: "fees",
    name: "Fee Dictionary",
    tagline: "Twenty-three processing fees in plain English.",
    description:
      "A searchable reference for every line a contractor is likely to find on a statement — what it is, whether it's pass-through cost or processor margin, what a fair version looks like and what 321 Swipe does about it. Each entry is its own page with structured data for search.",
    category: "Education",
    status: "live",
    href: "/fees",
    audience: "Anyone searching “what is a PCI non-compliance fee”",
    tags: ["23 entries", "Pass-through / markup / avoidable", "SEO pages"],
    tone: "navy",
  },
  {
    slug: "savings-calculator",
    name: "Member Savings Calculator",
    tagline: "What a fair rate is worth, in dollars.",
    description:
      "Slide in monthly card volume and current effective rate and see the annual difference at a benchmark rate, built for Blue Collar Success Group members. The same calculator pattern powers the CertainPath workflow review.",
    category: "Pricing",
    status: "live",
    href: "/blue-collar-success-group#calculator",
    audience: "Partner-program members",
    tags: ["Live sliders", "Annual impact", "Partner-branded"],
    tone: "light",
  },
  {
    slug: "workflow-review",
    name: "Payment Workflow Review",
    tagline: "Three steps to a picture of how a contractor gets paid.",
    description:
      "A guided intake for CertainPath members: volume and rate, how payments come in (field, office, invoice, ACH), and how deposits are tracked. It produces a first read on where the workflow leaks money before a human review begins.",
    category: "Operations",
    status: "live",
    href: "/certainpath#workflow-review",
    audience: "CertainPath members",
    tags: ["Guided intake", "Payment mix", "Deposit visibility"],
    tone: "warm",
  },
  {
    slug: "statement-upload",
    name: "Secure Statement Upload",
    tagline: "The front door for every free review.",
    description:
      "A dedicated portal where a business drops a PDF or a phone photo of its statement and it lands with a 321 Swipe analyst. Rep and partner pages tag their uploads so each review routes to the right person.",
    category: "Operations",
    status: "live",
    href: "https://upload.321swipe.com",
    audience: "Every prospect",
    tags: ["PDF or photo", "Rep routing", "Analyst queue"],
    tone: "navy",
  },
  // ── Tools built outside this site — fill in href + description, drop a screenshot in public/software/ ──
  {
    slug: "statement-analyzer",
    name: "Statement Analyzer",
    tagline: "The engine behind the monthly review.",
    description:
      "Reads a processor statement, classifies every line as pass-through, markup or avoidable, benchmarks the effective rate against businesses of the same size and trade, and produces the marked-up review a client receives each month. [Confirm description and add the demo URL.]",
    category: "Analysis",
    status: "soon",
    audience: "321 Swipe analysts and clients",
    tags: ["Line classification", "Benchmarking", "Monthly review"],
    tone: "navy",
  },
  {
    slug: "pricing-model-lab",
    name: "Pricing Model Lab",
    tagline: "Interchange-plus, flat and tiered, side by side.",
    description:
      "Models what the same month of card volume costs under each pricing structure, with the card mix, average ticket and acceptance method dialed in. Built to show a business owner, in one screen, why the advertised rate and the effective rate are different numbers. [Confirm description and add the demo URL.]",
    category: "Pricing",
    status: "soon",
    audience: "Prospects and reps",
    tags: ["Three models", "Card-mix inputs", "Effective-rate comparison"],
    tone: "warm",
  },
  {
    slug: "payment-hub",
    name: "Payment Hub",
    tagline: "One place for payments, deposits and fees.",
    description:
      "A client-facing view of card activity, deposit timing and processing costs across locations, with the monthly review attached. The operating layer for a modern payments relationship rather than a statement in the mail. [Confirm description and add the demo URL.]",
    category: "Platform",
    status: "soon",
    audience: "321 Swipe clients",
    tags: ["Deposits", "Fees over time", "Multi-location"],
    tone: "light",
  },
];
