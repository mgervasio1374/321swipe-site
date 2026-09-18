/**
 * Renders the 321 Swipe merchant application as a PDF with pdfkit.
 *
 * Two modes share one layout:
 *   - blank  → printable form (scripts/blank-application.ts → public/…pdf)
 *   - filled → a submission, optionally AES-256 encrypted with a password,
 *              with uploaded images appended as pages.
 *
 * Server / script only (pdfkit is a Node library).
 */
import PDFDocument from "pdfkit";
import path from "node:path";
import fs from "node:fs";
import {
  type Application,
  type Principal,
  BUSINESS_TYPES,
  SITE_TYPES,
  LLC_TAX_CLASSES,
  fmtPhone,
  fmtSsn,
  fmtEin,
  digits,
  emptyApplication,
  emptyPrincipal,
} from "./schema";

export interface EmbeddedImage {
  label: string;
  filename: string;
  data: Buffer;
}

export interface RenderMeta {
  reference: string;
  submittedAt: Date;
  ip: string;
  userAgent: string;
}

export interface RenderOptions {
  app?: Application;
  meta?: RenderMeta;
  images?: EmbeddedImage[];
  /** When set, the PDF is encrypted (AES-256) and needs this password to open. */
  password?: string;
  logoPath?: string;
}

// ── Palette / metrics ──────────────────────────────────────────────────────
const NAVY = "#0c1524";
const NAVY_SOFT = "#132040";
const BLUE = "#2563eb";
const INK = "#111827";
const MUTED = "#6b7280";
const RULE = "#d7dde6";
const WHITE = "#ffffff";
const RED = "#b91c1c";

const PAGE_W = 612;
const PAGE_H = 792;
const M = 42; // margin
const CONTENT_W = PAGE_W - M * 2;
const GUTTER = 10;
const FIELD_H = 30;

type Doc = InstanceType<typeof PDFDocument>;

interface Field {
  label: string;
  value?: string;
  span: number; // out of 12
  lines?: number; // multi-line height in text lines (blank mode) / min height
  sensitive?: boolean;
}

class Layout {
  y = M;
  constructor(public doc: Doc, public blank: boolean) {}

  ensure(h: number) {
    if (this.y + h > PAGE_H - M - 24) {
      this.doc.addPage();
      this.y = M;
    }
  }

  section(title: string, note?: string) {
    this.ensure(90); // keep the header with at least one row
    const d = this.doc;
    d.save();
    d.rect(M, this.y + 6, CONTENT_W, 18).fill(NAVY);
    d.fillColor(WHITE).font("Helvetica-Bold").fontSize(8.5).text(title.toUpperCase(), M + 8, this.y + 11, { characterSpacing: 0.8, lineBreak: false });
    if (note) {
      d.fillColor("#bcd0ee").font("Helvetica").fontSize(7.5).text(note, M + 8, this.y + 11.5, { width: CONTENT_W - 16, align: "right", lineBreak: false });
    }
    d.restore();
    this.y += 30;
  }

  row(fields: Field[]) {
    const d = this.doc;
    const unit = (CONTENT_W - GUTTER * (fields.length - 1)) / 12;
    const totalSpan = fields.reduce((a, f) => a + f.span, 0);
    const scale = 12 / totalSpan;
    const ws = fields.map((f) => f.span * scale * unit);
    // Label heights (labels may wrap to two lines in narrow columns).
    const lhs = fields.map((f, i) => d.font("Helvetica-Bold").fontSize(6.5).heightOfString(f.label.toUpperCase(), { width: ws[i], characterSpacing: 0.4 }));
    const labelH = Math.max(...lhs, 8);
    let h = Math.max(FIELD_H, labelH + 20);
    fields.forEach((f, i) => {
      const w = ws[i];
      if (f.lines && f.lines > 1) h = Math.max(h, labelH + 4 + f.lines * 11);
      if (f.value && !this.blank) {
        const vh = d.font("Helvetica").fontSize(9.5).heightOfString(f.value, { width: w - 4 });
        h = Math.max(h, labelH + 6 + vh + 4);
      }
    });
    this.ensure(h + 4);
    let x = M;
    fields.forEach((f, i) => {
      const w = ws[i];
      d.fillColor(MUTED).font("Helvetica-Bold").fontSize(6.5).text(f.label.toUpperCase(), x, this.y + 2, { width: w, characterSpacing: 0.4 });
      if (!this.blank) {
        const v = f.value && f.value.trim() ? f.value : "—";
        d.fillColor(v === "—" ? MUTED : INK).font("Helvetica").fontSize(9.5).text(v, x + 1, this.y + labelH + 6, { width: w - 4 });
      }
      d.moveTo(x, this.y + h).lineTo(x + w, this.y + h).lineWidth(0.6).strokeColor(RULE).stroke();
      x += w + GUTTER;
    });
    this.y += h + 6;
  }

  /** A row of check-box options (blank) or the selected value (filled). */
  options(label: string, opts: readonly string[], selected?: string, perRow = 4, extra?: string) {
    const d = this.doc;
    if (!this.blank) {
      this.row([{ label, value: selected ? `${selected}${extra ? ` — ${extra}` : ""}` : "", span: 12 }]);
      return;
    }
    const rows = Math.ceil(opts.length / perRow);
    const h = 12 + rows * 13;
    this.ensure(h + 6);
    d.fillColor(MUTED).font("Helvetica-Bold").fontSize(6.5).text(label.toUpperCase(), M, this.y + 2, { characterSpacing: 0.4 });
    const cw = CONTENT_W / perRow;
    opts.forEach((o, i) => {
      const cx = M + (i % perRow) * cw;
      const cy = this.y + 13 + Math.floor(i / perRow) * 13;
      d.rect(cx, cy, 8, 8).lineWidth(0.7).strokeColor("#9aa5b5").stroke();
      d.fillColor(INK).font("Helvetica").fontSize(8).text(o, cx + 12, cy - 0.5, { width: cw - 14, lineBreak: false });
    });
    this.y += h + 6;
  }

  text(t: string, opts: { size?: number; color?: string; bold?: boolean; gap?: number; width?: number } = {}) {
    const d = this.doc;
    d.font(opts.bold ? "Helvetica-Bold" : "Helvetica").fontSize(opts.size ?? 8).fillColor(opts.color ?? INK);
    const h = d.heightOfString(t, { width: opts.width ?? CONTENT_W });
    this.ensure(h);
    d.text(t, M, this.y, { width: opts.width ?? CONTENT_W, lineGap: 1.5 });
    this.y += h + (opts.gap ?? 6);
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

const money = (s: string) => {
  const n = Number(String(s ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) : s;
};

const fmtDate = (d: Date) =>
  d.toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "long", timeStyle: "short" }) + " ET";

const dobText = (dob: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob || "");
  return m ? `${m[2]}/${m[3]}/${m[1]}` : dob;
};

function header(d: Doc, L: Layout, blank: boolean, meta?: RenderMeta, logoPath?: string) {
  const logo = logoPath && fs.existsSync(logoPath) ? logoPath : null;
  if (logo) d.image(logo, M, M - 6, { height: 34 });
  d.fillColor(NAVY).font("Helvetica-Bold").fontSize(15).text("Merchant Application", M + 110, M - 2, { width: CONTENT_W - 110, align: "right", lineBreak: false });
  d.fillColor(MUTED).font("Helvetica").fontSize(8).text(
    blank ? "Complete online at 321swipe.com/apply, or email this form to sales@321swipe.com" : `Reference ${meta?.reference ?? ""}  ·  Submitted ${meta ? fmtDate(meta.submittedAt) : ""}`,
    M + 110, M + 17, { width: CONTENT_W - 110, align: "right", lineBreak: false },
  );
  d.moveTo(M, M + 36).lineTo(M + CONTENT_W, M + 36).lineWidth(1).strokeColor(NAVY).stroke();
  L.y = M + 42;
}

function footer(d: Doc, blank: boolean, password?: string) {
  const range = d.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    d.switchToPage(i);
    // Writing inside the bottom margin would otherwise trigger an automatic page break.
    const saved = d.page.margins.bottom;
    d.page.margins.bottom = 0;
    d.fillColor(MUTED).font("Helvetica").fontSize(7);
    const left = blank
      ? "321 Swipe · sales@321swipe.com · 321swipe.com"
      : password
        ? "CONFIDENTIAL — contains personal and banking information. Encrypted; do not forward outside 321 Swipe."
        : "CONFIDENTIAL — contains personal and banking information.";
    d.text(left, M, PAGE_H - M + 8, { width: CONTENT_W - 60, lineBreak: false });
    d.text(`Page ${i - range.start + 1} of ${range.count}`, M, PAGE_H - M + 8, { width: CONTENT_W, align: "right", lineBreak: false });
    d.page.margins.bottom = saved;
  }
}

function principalBlock(L: Layout, p: Principal, n: number, blank: boolean) {
  const d = L.doc;
  L.ensure(120);
  d.fillColor(BLUE).font("Helvetica-Bold").fontSize(8).text(`Owner / Principal #${n}`, M, L.y + 2);
  L.y += 14;
  L.row([
    { label: "Full legal name", value: p.name, span: 5 },
    { label: "Title", value: p.title, span: 3 },
    { label: "% Owned", value: p.percentOwned ? `${digits(p.percentOwned)}%` : "", span: 1.5 },
    { label: "Phone", value: fmtPhone(p.phone), span: 2.5 },
  ]);
  L.row([
    { label: "Email", value: p.email, span: 4 },
    { label: "Date of birth", value: dobText(p.dob), span: 2 },
    { label: "Social Security #", value: blank ? "" : fmtSsn(p.ssn), span: 2, sensitive: true },
    { label: "ID type", value: p.idType, span: 2 },
    { label: "ID state / country", value: p.idState, span: 2 },
  ]);
  L.row([
    { label: "Home street address", value: p.address.street, span: 4.5 },
    { label: "City", value: p.address.city, span: 2.5 },
    { label: "State", value: p.address.state, span: 1.5 },
    { label: "ZIP", value: p.address.zip, span: 1.5 },
    { label: "Country", value: p.address.country, span: 2 },
  ]);
  L.y += 4;
}

// ── Main ───────────────────────────────────────────────────────────────────

export function renderApplicationPdf(opts: RenderOptions): Promise<Buffer> {
  const blank = !opts.app;
  const app = opts.app ?? emptyApplication();
  const meta = opts.meta;

  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: M, bottom: M, left: M, right: M },
    bufferPages: true,
    autoFirstPage: true,
    info: {
      Title: blank ? "321 Swipe Merchant Application" : `321 Swipe Merchant Application — ${app.company.dba}`,
      Author: "321 Swipe",
      Subject: "Merchant Application",
      Creator: "321swipe.com/apply",
    },
    ...(opts.password
      ? {
          pdfVersion: "1.7ext3" as const,
          userPassword: opts.password,
          ownerPassword: opts.password,
          permissions: { printing: "highResolution" as const, modifying: false, copying: false, annotating: false, fillingForms: false },
        }
      : {}),
  });

  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  const L = new Layout(doc, blank);
  const logoPath = opts.logoPath ?? path.join(process.cwd(), "public", "logo-print.png");
  header(doc, L, blank, meta, logoPath);

  const c = app.company;
  const b = app.business;
  const k = app.bank;

  // Company profile
  L.section("Company profile");
  L.row([
    { label: "Merchant name (DBA)", value: c.dba, span: 6 },
    { label: "Corporate / legal name", value: c.legalName, span: 6 },
  ]);
  L.row([
    { label: "Location street address", value: c.location.street, span: 4.5 },
    { label: "City", value: c.location.city, span: 2.5 },
    { label: "State", value: c.location.state, span: 1.5 },
    { label: "ZIP", value: c.location.zip, span: 1.5 },
    { label: "Country", value: c.location.country, span: 2 },
  ]);
  const bill = c.billingSameAsLocation ? c.location : c.billing;
  L.row([
    { label: "Corporate / billing street address", value: blank ? "" : c.billingSameAsLocation ? "Same as location" : bill.street, span: 4.5 },
    { label: "City", value: blank || c.billingSameAsLocation ? "" : bill.city, span: 2.5 },
    { label: "State", value: blank || c.billingSameAsLocation ? "" : bill.state, span: 1.5 },
    { label: "ZIP", value: blank || c.billingSameAsLocation ? "" : bill.zip, span: 1.5 },
    { label: "Country", value: blank || c.billingSameAsLocation ? "" : bill.country, span: 2 },
  ]);
  L.row([
    { label: "Primary contact", value: c.contactName, span: 4 },
    { label: "Email", value: c.contactEmail, span: 4 },
    { label: "Telephone", value: fmtPhone(c.phone), span: 2 },
    { label: "Mobile", value: fmtPhone(c.mobile), span: 2 },
  ]);
  L.row([
    { label: "Billing contact", value: c.billingContactName, span: 4 },
    { label: "Billing email", value: c.billingContactEmail, span: 4 },
    { label: "Country formed", value: c.countryOfFormation, span: 2 },
    { label: "Federal Tax ID (EIN)", value: blank ? "" : fmtEin(c.federalTaxId), span: 2, sensitive: true },
  ]);
  L.options("Type of business", BUSINESS_TYPES, c.businessType, 4, c.businessType.startsWith("LLC") ? c.llcTaxClass : undefined);
  if (blank) L.options("If LLC — tax classification", LLC_TAX_CLASSES, undefined, 6);
  L.options("Site survey — location type", SITE_TYPES, c.siteType === "Other" ? `Other: ${c.siteTypeOther}` : c.siteType, 6);
  L.row([
    { label: "Legal name & address same as DBA?", value: c.legalSameAsDba ? (c.legalSameAsDba === "yes" ? "Yes" : "No") : "", span: 4 },
    { label: "Year established", value: c.yearEstablished, span: 2 },
    { label: "Years in business", value: c.yearsInBusiness, span: 2 },
    { label: "Annual revenue", value: money(c.annualRevenue), span: 2 },
    { label: "Employees", value: c.employees, span: 2 },
  ]);

  // Ownership
  L.section("Ownership profile", "Owners listed must total at least 50% of the business");
  const principals = blank ? [emptyPrincipal(), emptyPrincipal()] : app.principals;
  principals.forEach((p, i) => principalBlock(L, p, i + 1, blank));

  // Business profile
  L.section("Business profile");
  L.row([{ label: "Profile of the company", value: b.description, span: 12, lines: 3 }]);
  L.row([
    { label: "Current processor", value: b.currentProcessor, span: 4 },
    { label: "Current gateway / software", value: b.currentGateway, span: 4 },
    { label: "Website", value: b.website, span: 4 },
  ]);
  L.row([
    { label: "Card present", value: b.pctSwipe ? `${digits(b.pctSwipe)}%` : "", span: 2 },
    { label: "Online (internet)", value: b.pctInternet ? `${digits(b.pctInternet)}%` : "", span: 2 },
    { label: "Phone / mail (MOTO)", value: b.pctMoto ? `${digits(b.pctMoto)}%` : "", span: 2 },
    { label: "Monthly volume", value: money(b.monthlyVolume), span: 2 },
    { label: "Average ticket", value: money(b.averageTicket), span: 2 },
    { label: "Highest ticket", value: money(b.highestTicket), span: 2 },
  ]);
  L.row([
    { label: "Products / services sold", value: b.products, span: 8, lines: 2 },
    {
      label: "Industry association member?",
      value: b.industryAssociation ? (b.industryAssociation === "yes" ? `Yes — ${b.industryAssociationName}` : "No") : "",
      span: 4,
      lines: 2,
    },
  ]);

  // Bank
  L.section("Bank information", "Deposits and fees settle to this account");
  L.row([
    { label: "Bank name", value: k.bankName, span: 5 },
    { label: "ABA routing #", value: blank ? "" : digits(k.routing), span: 3.5, sensitive: true },
    { label: "Account #", value: blank ? "" : digits(k.account), span: 3.5, sensitive: true },
  ]);

  // Requirements (blank) / signature (both)
  if (blank) {
    L.section("Supporting documents & requirements");
    L.text(
      "Personal Guarantee or business financials: any time a PG is signed, an SSN is required. If a PG is not obtained, the most recent year of third-party reviewed or audited financial statements is required (balance sheet, income statement, statement of cash flows and notes). Financials not prepared by a third party must be accompanied by the same year's federal income tax return.",
      { size: 7.5, color: RED, gap: 8 },
    );
    const col = CONTENT_W / 2 - 8;
    const y0 = L.y;
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(INK).text("Retail / face-to-face", M, y0);
    doc.font("Helvetica").fontSize(7.5).fillColor(INK).text(
      "If an on-site inspection is not completed, one of the following is required (DBA and/or corporation name must match the document): copy of principal's license, certificate of incorporation, certified articles of incorporation, or business / operating agreement.\n\nCard-not-present: 3 months of current processing statements.",
      M, y0 + 11, { width: col, lineGap: 1.5 },
    );
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(INK).text("Internet companies", M + col + 16, y0);
    doc.font("Helvetica").fontSize(7.5).fillColor(INK).text(
      "3 months of current processing statements. The website must display the company name, a customer service number or email, refund/return policy, delivery methods and timing, privacy policy, prices for products/services, a secure checkout page, and the domain must be registered to the company.\n\nNon-profit: proof of tax-exempt status (501(c)(3)).",
      M + col + 16, y0 + 11, { width: col, lineGap: 1.5 },
    );
    L.y = Math.max(doc.y, y0 + 90) + 10;
  }

  L.section("Certification & signature");
  L.text(
    "I certify that the information provided in this application is true, complete and accurate, and I authorize 321 Swipe and its processing partners to verify it, including with the bank named above and, where permitted by law, through credit and identity checks on the business and its listed owners. I understand this application is a request for services and does not itself create a merchant agreement.",
    { size: 7.5, color: INK, gap: 10 },
  );
  if (blank) {
    L.row([
      { label: "Signature", span: 5 },
      { label: "Printed name", span: 4 },
      { label: "Title", span: 2 },
      { label: "Date", span: 1.5 },
    ]);
  } else {
    L.ensure(60);
    doc.font("Helvetica-Oblique").fontSize(16).fillColor(NAVY_SOFT).text(app.signature.name, M + 2, L.y + 2, { lineBreak: false });
    L.y += 24;
    L.row([
      { label: "Electronically signed by", value: `${app.signature.name}, ${app.signature.title}`, span: 5 },
      { label: "Date / time", value: meta ? fmtDate(meta.submittedAt) : "", span: 3.5 },
      { label: "IP address", value: meta?.ip ?? "", span: 3.5 },
    ]);
    L.text(`Browser: ${meta?.userAgent ?? ""}`, { size: 6.5, color: MUTED });
  }

  // Embedded images
  for (const img of opts.images ?? []) {
    doc.addPage();
    doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(11).text(img.label, M, M);
    doc.fillColor(MUTED).font("Helvetica").fontSize(8).text(img.filename, M, M + 15);
    try {
      doc.image(img.data, M, M + 32, { fit: [CONTENT_W, PAGE_H - M * 2 - 40], align: "center" });
    } catch {
      doc.fillColor(RED).font("Helvetica").fontSize(9).text("This image could not be embedded (unsupported format). It is attached to the email separately.", M, M + 40);
    }
  }

  footer(doc, blank, opts.password);
  doc.end();
  return done;
}
