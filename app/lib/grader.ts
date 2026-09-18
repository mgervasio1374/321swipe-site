/**
 * "Grade my statement" — questions, scoring and result copy.
 *
 * Scoring is deliberately simple and transparent: six questions, 100 points,
 * letter grade by band. Every finding links to the fee dictionary so the
 * result teaches as well as scores. Answers are encoded into the URL (?a=…)
 * so a result can be shared or sent to a rep.
 */

export interface Option {
  label: string;
  points: number;
  /** Finding shown on the result if this option was chosen (null = nothing to flag). */
  finding?: { text: string; fee?: string; good?: boolean } | null;
}

export interface Question {
  id: string;
  title: string;
  help?: string;
  weight: number;
  multi?: boolean;
  options: Option[];
}

export const QUESTIONS: Question[] = [
  {
    id: "pricing",
    title: "How is your processing priced?",
    help: "It's usually printed near the top of the statement or in your agreement. If you see words like “qualified” and “non-qualified”, that's tiered.",
    weight: 25,
    options: [
      { label: "Interchange-plus (cost plus a fixed markup)", points: 25, finding: { text: "You're on interchange-plus — the transparent model. Every card's real cost shows, and the markup is a single number you can negotiate.", fee: "discount-rate-markup", good: true } },
      { label: "Flat rate (one percentage for everything)", points: 15, finding: { text: "Flat-rate pricing is simple but usually expensive for a business your size: you pay a rewards-card rate on every debit card.", fee: "discount-rate-markup" } },
      { label: "Tiered (qualified / mid-qualified / non-qualified)", points: 0, finding: { text: "Tiered pricing is where most avoidable cost lives. The advertised rate applies to a shrinking share of your sales; the rest is surcharged.", fee: "non-qualified-surcharge" } },
      { label: "I don't know", points: 5, finding: { text: "Not knowing the pricing model is the most common answer we hear — and the first thing a review clears up.", fee: "discount-rate-markup" } },
    ],
  },
  {
    id: "rate",
    title: "What's your effective rate?",
    help: "Total fees for the month divided by total card sales. Use the calculator if you have last month's numbers handy.",
    weight: 25,
    options: [
      { label: "Under 2.3%", points: 25, finding: { text: "An effective rate under 2.3% is competitive for a home-service or Main Street business. Keep an eye on it — it drifts.", good: true } },
      { label: "2.3% – 2.8%", points: 18, finding: { text: "2.3–2.8% is average. There's usually a few tenths to recover, mostly in the markup and flat fees." } },
      { label: "2.8% – 3.3%", points: 8, finding: { text: "An effective rate near 3% almost always means downgrades or padded markup. That's real money at your volume.", fee: "non-qualified-surcharge" } },
      { label: "Over 3.3%", points: 0, finding: { text: "Over 3.3% is a red flag on its own. Something on the statement — tiers, surcharges or junk fees — is well out of line.", fee: "non-qualified-surcharge" } },
      { label: "I don't know", points: 5, finding: { text: "Your effective rate is the one number worth knowing. It takes thirty seconds with a statement in hand.", fee: "discount-rate-markup" } },
    ],
  },
  {
    id: "contract",
    title: "What does your agreement say about leaving?",
    weight: 15,
    options: [
      { label: "Month-to-month, no termination fee", points: 15, finding: { text: "Month-to-month with no exit fee — you have leverage, and your processor knows it.", fee: "early-termination-fee", good: true } },
      { label: "A term, but no termination fee", points: 10, finding: { text: "A term without a termination fee is fine, as long as it doesn't auto-renew into one. Check the renewal clause.", fee: "auto-renewal" } },
      { label: "A term with a termination fee or liquidated damages", points: 0, finding: { text: "A termination fee — especially “liquidated damages” — is the main reason businesses stay on bad pricing. It can usually be reduced or offset.", fee: "early-termination-fee" } },
      { label: "I don't know", points: 4, finding: { text: "If you don't know the exit terms, assume there's a term with a fee and an auto-renewal window. We'd read the agreement first.", fee: "auto-renewal" } },
    ],
  },
  {
    id: "junk",
    title: "Which of these appear on your statement?",
    help: "Pick every one you recognize. Names vary a little by processor.",
    weight: 15,
    multi: true,
    options: [
      { label: "PCI non-compliance fee", points: -4, finding: { text: "A PCI non-compliance fee is a penalty for an unfiled questionnaire. It should be $0 and it's fixable in twenty minutes.", fee: "pci-non-compliance-fee" } },
      { label: "Regulatory / product / compliance fee", points: -3, finding: { text: "“Regulatory” or “product” fees sound official and aren't. Ask what regulation — then have it removed.", fee: "regulatory-product-fee" } },
      { label: "Batch or batch header fee", points: -2, finding: { text: "Batch fees are a relic. Most processors have dropped them; yours should too.", fee: "batch-header-fee" } },
      { label: "Annual or membership fee", points: -3, finding: { text: "An annual fee covers nothing. It's easy to miss because it shows up once a year.", fee: "annual-fee" } },
      { label: "Monthly minimum", points: -2, finding: { text: "Monthly minimums bite in slow months. They're routinely waived once volume is established.", fee: "minimum-monthly" } },
      { label: "Statement fee", points: -1, finding: { text: "A statement fee for a PDF. Small, but it's the kind of line that adds up with its neighbors.", fee: "statement-fee" } },
      { label: "None of these", points: 0, finding: { text: "No junk fees you recognize — that's better than most statements we see.", good: true } },
    ],
  },
  {
    id: "equipment",
    title: "How did you get your card terminal or reader?",
    weight: 10,
    options: [
      { label: "We bought it outright", points: 10, finding: { text: "Owning your equipment is the right call. Nothing follows you if you ever switch.", fee: "equipment-lease", good: true } },
      { label: "The processor placed it free", points: 6, finding: { text: "Free placement is fine — just confirm it doesn't come with a wireless fee or a return penalty.", fee: "wireless-fee" } },
      { label: "It's on a lease", points: 0, finding: { text: "A terminal lease is usually $1,500–$2,000 over its life for a $300 device, and it survives switching processors. Worth a buyout plan.", fee: "equipment-lease" } },
      { label: "Not sure", points: 4, finding: { text: "Check your bank statement for a leasing-company debit — leases are billed separately and easy to forget.", fee: "equipment-lease" } },
    ],
  },
  {
    id: "review",
    title: "When did someone last go through your statement line by line?",
    weight: 10,
    options: [
      { label: "In the last six months", points: 10, finding: { text: "Recently reviewed. The main risk now is drift — rates and fees change without notice.", good: true } },
      { label: "Within the last year", points: 7, finding: { text: "A year is long enough for a new fee or a rate change to slip in. Worth a fresh look." } },
      { label: "Over a year ago, or never", points: 2, finding: { text: "Statements that haven't been read in a year almost always have something on them. That's what the free review is for." } },
    ],
  },
];

export type Answers = Record<string, number[]>; // question id → selected option indices

export function score(answers: Answers) {
  let total = 0;
  const findings: { text: string; fee?: string; good?: boolean }[] = [];
  for (const q of QUESTIONS) {
    const sel = answers[q.id] ?? [];
    if (q.multi) {
      const noneIdx = q.options.findIndex((o) => o.points === 0 && o.finding?.good);
      const chosen = sel.filter((i) => i !== noneIdx);
      const deductions = chosen.reduce((a, i) => a + q.options[i].points, 0);
      total += Math.max(0, q.weight + deductions);
      if (chosen.length === 0 && sel.includes(noneIdx)) findings.push(q.options[noneIdx].finding!);
      for (const i of chosen) if (q.options[i].finding) findings.push(q.options[i].finding!);
    } else if (sel.length) {
      const o = q.options[sel[0]];
      total += o.points;
      if (o.finding) findings.push(o.finding);
    }
  }
  return { total, findings };
}

export const GRADES = [
  { letter: "A", min: 85, color: "#15803d", bg: "#f0fdf4", headline: "You're in good shape.", body: "Your processing is priced and structured the way it should be. The only thing to watch is drift — rates and fees change quietly, so a yearly look keeps the grade." },
  { letter: "B", min: 70, color: "#0f766e", bg: "#f0fdfa", headline: "Solid, with a little on the table.", body: "Nothing alarming, but there's likely a few tenths of a percent and a couple of flat fees to recover. A review usually pays for the time in the first month." },
  { letter: "C", min: 55, color: "#b45309", bg: "#fffbeb", headline: "Average — which is the problem.", body: "The average statement carries several hundred dollars a year in avoidable cost. Yours probably does too. The fixes below are the common ones." },
  { letter: "D", min: 40, color: "#c2410c", bg: "#fff7ed", headline: "You're paying for things you shouldn't.", body: "Between the pricing model, the fees you recognized and the contract, this statement has more than one leak. It's worth an hour with someone who reads these for a living." },
  { letter: "F", min: 0, color: "#b91c1c", bg: "#fef2f2", headline: "Send us this statement.", body: "Tiered pricing, junk fees and an exit penalty tend to travel together, and this looks like one of those accounts. The good news: these are exactly the statements where a review changes the most." },
] as const;

export const gradeFor = (total: number) => GRADES.find((g) => total >= g.min) ?? GRADES[GRADES.length - 1];

// ── URL encoding ──────────────────────────────────────────────────────────────
// ?a=0.1.2.03.1.0  → one field per question in QUESTIONS order; multi = concatenated indices; "-" = unanswered

export function encode(answers: Answers): string {
  return QUESTIONS.map((q) => {
    const sel = answers[q.id];
    if (!sel || sel.length === 0) return "-";
    return sel.join("");
  }).join(".");
}

export function decode(s: string | null): Answers | null {
  if (!s) return null;
  const parts = s.split(".");
  if (parts.length !== QUESTIONS.length) return null;
  const out: Answers = {};
  parts.forEach((p, qi) => {
    if (p === "-") return;
    const q = QUESTIONS[qi];
    const idx = p.split("").map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n < q.options.length);
    if (idx.length) out[q.id] = q.multi ? Array.from(new Set(idx)) : [idx[0]];
  });
  return Object.keys(out).length === QUESTIONS.length ? out : null;
}
