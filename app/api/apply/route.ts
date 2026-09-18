/**
 * POST /api/apply — receives the merchant application.
 *
 * Security model
 *  - TLS in transit (Vercel). Nothing is written to disk or a database: the
 *    submission lives in memory for the life of this request and is gone after.
 *  - The full application is rendered to a PDF encrypted with AES-256
 *    (APPLICATION_PDF_PASSWORD). Photos of checks / IDs are embedded inside
 *    that encrypted PDF, never attached in the clear.
 *  - The email body shows only masked SSN / EIN / account numbers.
 *  - Bot defences: Cloudflare Turnstile (when configured), honeypot field,
 *    minimum time-on-form, per-IP throttle, strict size limits.
 *  - No sensitive value is ever logged.
 *
 * Required env (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY              transactional email
 *   APPLICATION_PDF_PASSWORD    password sales uses to open the PDF
 * Optional:
 *   APPLICATION_TO              default sales@321swipe.com
 *   APPLICATION_FROM            default "321 Swipe <applications@321swipe.com>" (domain must be verified in Resend)
 *   TURNSTILE_SECRET_KEY        enables Turnstile verification (pair with NEXT_PUBLIC_TURNSTILE_SITE_KEY)
 */
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import crypto from "node:crypto";
import {
  type Application,
  validateAll,
  digits,
  maskSsn,
  maskEin,
  maskAccount,
  fmtPhone,
  DOCUMENT_SLOTS,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  MAX_FILES,
} from "@/app/lib/application/schema";
import { renderApplicationPdf, type EmbeddedImage } from "@/app/lib/application/pdf";

export const runtime = "nodejs";
export const maxDuration = 30;

const TO = process.env.APPLICATION_TO || "sales@321swipe.com";
const FROM = process.env.APPLICATION_FROM || "321 Swipe <applications@321swipe.com>";
const MIN_SECONDS_ON_FORM = 20;
const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 6 };

const IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);
const FILE_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);

// Best-effort throttle (per warm instance). Turnstile is the real defence.
const hits = new Map<string, number[]>();
function throttled(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > RATE_LIMIT.max;
}

const bad = (message: string, status = 400, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ ok: false, message, ...extra }, { status, headers: { "Cache-Control": "no-store" } });

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] as string);

function reference(): string {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(5);
  let tail = "";
  for (const b of bytes) tail += alphabet[b % alphabet.length];
  return `APP-${ymd}-${tail}`;
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured → skip
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

function money(s: string) {
  const n = Number(String(s ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) : esc(s);
}

function summaryHtml(app: Application, ref: string, ip: string, files: { label: string; name: string; embedded: boolean }[]) {
  const c = app.company, b = app.business, k = app.bank;
  const row = (l: string, v: string) =>
    `<tr><td style="padding:6px 10px;color:#6b7280;font-size:12px;white-space:nowrap;vertical-align:top">${esc(l)}</td><td style="padding:6px 10px;font-size:13px;color:#111827">${v || "—"}</td></tr>`;
  const section = (t: string, rows: string) =>
    `<h3 style="margin:22px 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#0c1524">${esc(t)}</h3><table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;border:1px solid #e5e7eb;border-radius:8px">${rows}</table>`;
  const addr = (a: Application["company"]["location"]) => esc([a.street, `${a.city}, ${a.state} ${a.zip}`, a.country].filter(Boolean).join(", "));

  const owners = app.principals
    .map(
      (p, i) =>
        row(`Owner ${i + 1}`, `<b>${esc(p.name)}</b>, ${esc(p.title)} — ${esc(digits(p.percentOwned))}%<br>${esc(p.email)} · ${esc(fmtPhone(p.phone))}<br>SSN ${esc(maskSsn(p.ssn))} · DOB in PDF · ${esc(p.idType)} (${esc(p.idState)})<br>${addr(p.address)}`),
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f6fa;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif">
  <div style="max-width:680px;margin:0 auto;background:#fff;border-radius:12px;padding:28px 32px;border:1px solid #e5e7eb">
    <p style="margin:0;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#2563eb;font-weight:700">New merchant application</p>
    <h1 style="margin:6px 0 2px;font-size:22px;color:#0c1524">${esc(c.dba)}</h1>
    <p style="margin:0;color:#6b7280;font-size:13px">${esc(c.legalName)} · Ref <b>${esc(ref)}</b></p>

    <div style="margin:18px 0 0;padding:12px 14px;border-radius:8px;background:#fff7ed;border:1px solid #fed7aa;font-size:12.5px;color:#7c2d12;line-height:1.5">
      <b>The complete application is the attached PDF.</b> It is encrypted — open it with the 321 Swipe application password.
      SSN, EIN, date of birth and bank account numbers appear only inside the PDF; this email shows masked values.
      Please don't forward the PDF outside the company.
    </div>

    ${section("Contact", row("Primary contact", `${esc(c.contactName)} · <a href="mailto:${esc(c.contactEmail)}">${esc(c.contactEmail)}</a>`) + row("Phone", `${esc(fmtPhone(c.phone))}${c.mobile ? ` · mobile ${esc(fmtPhone(c.mobile))}` : ""}`) + row("Billing contact", `${esc(c.billingContactName)} ${c.billingContactEmail ? `· ${esc(c.billingContactEmail)}` : ""}`))}

    ${section("Company", row("Location", addr(c.location)) + row("Billing address", c.billingSameAsLocation ? "Same as location" : addr(c.billing)) + row("Legal name/address same as DBA", c.legalSameAsDba === "yes" ? "Yes" : "No") + row("Business type", `${esc(c.businessType)}${c.llcTaxClass ? ` — taxed as ${esc(c.llcTaxClass)}` : ""}`) + row("Federal Tax ID", esc(maskEin(c.federalTaxId))) + row("Formed in", esc(c.countryOfFormation)) + row("Location type", esc(c.siteType === "Other" ? `Other: ${c.siteTypeOther}` : c.siteType)) + row("Established", `${esc(c.yearEstablished)} (${esc(c.yearsInBusiness || "—")} in business)`) + row("Annual revenue", money(c.annualRevenue)) + row("Employees", esc(c.employees)))}

    ${section("Ownership", owners)}

    ${section("Business", row("Profile", esc(b.description)) + row("Products / services", esc(b.products)) + row("Current processor", esc(b.currentProcessor)) + row("Gateway / software", esc(b.currentGateway)) + row("Website", esc(b.website)) + row("Acceptance mix", `Card present ${esc(digits(b.pctSwipe) || "0")}% · Online ${esc(digits(b.pctInternet) || "0")}% · Phone/mail ${esc(digits(b.pctMoto) || "0")}%`) + row("Monthly volume", money(b.monthlyVolume)) + row("Average / highest ticket", `${money(b.averageTicket)} / ${money(b.highestTicket)}`) + row("Industry association", b.industryAssociation === "yes" ? `Yes — ${esc(b.industryAssociationName)}` : "No"))}

    ${section("Banking", row("Bank", esc(k.bankName)) + row("Routing", `••••••${esc(digits(k.routing).slice(-3))}`) + row("Account", esc(maskAccount(k.account))))}

    ${section("Documents", files.length ? files.map((f) => row(f.label, `${esc(f.name)} ${f.embedded ? "<span style='color:#6b7280'>(inside the encrypted PDF)</span>" : "<span style='color:#6b7280'>(attached)</span>"}`)).join("") : row("Uploaded", "None — follow up for a voided check and owner ID."))}

    ${section("Signature", row("Signed by", `${esc(app.signature.name)}, ${esc(app.signature.title)}`) + row("From IP", esc(ip)))}

    <p style="margin:22px 0 0;font-size:11px;color:#9ca3af">Submitted via 321swipe.com/apply. Nothing from this application is stored on the website.</p>
  </div></body></html>`;
}

function confirmationHtml(app: Application, ref: string) {
  const first = (app.company.contactName || "").split(" ")[0] || "there";
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f6fa;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:28px 32px;border:1px solid #e5e7eb;color:#111827;font-size:15px;line-height:1.6">
    <p style="margin:0 0 14px">Hi ${esc(first)},</p>
    <p style="margin:0 0 14px">We received the merchant application for <b>${esc(app.company.dba)}</b>. Your reference number is <b>${esc(ref)}</b>.</p>
    <p style="margin:0 0 14px">Someone from our team will review it and reach out within one business day. If we need anything else — a voided check, an owner ID, or recent statements — we'll let you know exactly what and how to send it securely.</p>
    <p style="margin:0 0 14px">For your protection, this email doesn't include any of the details you entered. Your application was transmitted over an encrypted connection and delivered to our team as an encrypted document.</p>
    <p style="margin:0">Questions? Reply to this email or write to <a href="mailto:sales@321swipe.com">sales@321swipe.com</a>.</p>
    <p style="margin:22px 0 0;color:#6b7280;font-size:13px">— The 321 Swipe team</p>
  </div></body></html>`;
}

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  const ua = req.headers.get("user-agent") ?? "";

  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_TOTAL_BYTES + 512 * 1024) return bad("The submission is too large. Please attach smaller files (under 4 MB total) or send documents separately.", 413);

  if (!process.env.RESEND_API_KEY || !process.env.APPLICATION_PDF_PASSWORD) {
    console.error("[apply] missing RESEND_API_KEY or APPLICATION_PDF_PASSWORD");
    return bad("Online applications are temporarily unavailable. Please email sales@321swipe.com.", 503);
  }

  if (throttled(ip)) return bad("Too many submissions from this network. Please try again in an hour or email sales@321swipe.com.", 429);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad("Couldn't read the submission.");
  }

  // Bot checks
  if (String(form.get("website_url") ?? "").length > 0) return bad("Submission rejected.");
  let app: Application;
  try {
    app = JSON.parse(String(form.get("payload") ?? "")) as Application;
  } catch {
    return bad("Couldn't read the submission.");
  }
  if (!app || typeof app !== "object" || !app.company || !Array.isArray(app.principals)) return bad("Couldn't read the submission.");
  if (!(Number(app.startedAt) > 0) || Date.now() - Number(app.startedAt) < MIN_SECONDS_ON_FORM * 1000) return bad("Submission rejected.");
  if (!(await verifyTurnstile(String(form.get("turnstile") ?? ""), ip))) return bad("We couldn't verify you're not a bot. Please reload the page and try again.");

  // Validate
  app.principals = app.principals.slice(0, 4);
  const errors = validateAll(app);
  if (Object.keys(errors).length) return bad("Some fields need attention.", 422, { errors });

  // Files
  const embedded: EmbeddedImage[] = [];
  const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
  const fileList: { label: string; name: string; embedded: boolean }[] = [];
  let total = 0, count = 0;
  for (const slot of DOCUMENT_SLOTS) {
    const entries = form.getAll(`doc_${slot.key}`);
    for (const entry of entries) {
      if (!(entry instanceof File) || entry.size === 0) continue;
      count += 1;
      total += entry.size;
      if (count > MAX_FILES) return bad(`Please attach no more than ${MAX_FILES} files.`);
      if (entry.size > MAX_FILE_BYTES) return bad(`"${entry.name}" is too large. Files must be under ${Math.round(MAX_FILE_BYTES / 1024 / 1024)} MB.`);
      if (total > MAX_TOTAL_BYTES) return bad("Attachments total more than 4 MB. Please remove one or send it separately.");
      if (!FILE_TYPES.has(entry.type)) return bad(`"${entry.name}" isn't a supported type. Please upload a JPG, PNG or PDF.`);
      const data = Buffer.from(await entry.arrayBuffer());
      const safeName = entry.name.replace(/[^\w.\-]+/g, "_").slice(0, 80) || "file";
      if (IMAGE_TYPES.has(entry.type)) {
        embedded.push({ label: slot.label, filename: safeName, data });
        fileList.push({ label: slot.label, name: safeName, embedded: true });
      } else {
        attachments.push({ filename: `${slot.key}-${safeName}`, content: data, contentType: entry.type });
        fileList.push({ label: slot.label, name: safeName, embedded: false });
      }
    }
  }

  const ref = reference();
  const submittedAt = new Date();

  let pdf: Buffer;
  try {
    pdf = await renderApplicationPdf({
      app,
      meta: { reference: ref, submittedAt, ip, userAgent: ua },
      images: embedded,
      password: process.env.APPLICATION_PDF_PASSWORD,
    });
  } catch (err) {
    console.error(`[apply] ${ref} pdf render failed`, err instanceof Error ? err.message : err);
    return bad("We couldn't process the application. Please try again or email sales@321swipe.com.", 500);
  }

  const dbaSlug = app.company.dba.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "merchant";
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: FROM,
    to: [TO],
    replyTo: app.company.contactEmail,
    subject: `Merchant application — ${app.company.dba} (${ref})`,
    html: summaryHtml(app, ref, ip, fileList),
    attachments: [
      { filename: `321Swipe-Application-${dbaSlug}-${ref}.pdf`, content: pdf, contentType: "application/pdf" },
      ...attachments,
    ],
    headers: { "X-Entity-Ref-ID": ref },
  });
  if (error) {
    console.error(`[apply] ${ref} email failed: ${error.name} ${error.message}`);
    return bad("We couldn't deliver the application. Please try again in a moment or email sales@321swipe.com.", 502);
  }

  // Applicant confirmation — never blocks the response, contains no sensitive data.
  try {
    await resend.emails.send({
      from: FROM,
      to: [app.company.contactEmail],
      replyTo: TO,
      subject: `We received your application (${ref}) — 321 Swipe`,
      html: confirmationHtml(app, ref),
    });
  } catch {
    /* ignore */
  }

  console.log(`[apply] ${ref} delivered (${count} files, ${(len / 1024).toFixed(0)} KB)`);
  return NextResponse.json({ ok: true, reference: ref }, { headers: { "Cache-Control": "no-store" } });
}
