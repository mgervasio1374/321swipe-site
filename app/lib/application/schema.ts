/**
 * Merchant application — shared field model, options and validation.
 *
 * Used by the /apply form (client) and /api/apply (server). Keep this file
 * dependency-free so it can run in both places and in scripts/.
 */

export const BUSINESS_TYPES = [
  "Sole Proprietor",
  "LLC (Limited Liability Co.)",
  "Sub S Corporation",
  "Closely Held Corporation",
  "Public Corporation",
  "General Partnership",
  "Limited Partnership",
  "Tax Exempt Org. (501c3)",
  "Government",
  "Estate",
  "Trust",
  "Unincorporated Association",
] as const;

export const LLC_TAX_CLASSES = ["Disregarded entity", "Corporation", "Partnership"] as const;

export const SITE_TYPES = [
  "Separate building",
  "Office building",
  "Shopping center",
  "Private residence",
  "Kiosk",
  "Other",
] as const;

export const ID_TYPES = ["Driver's license", "State ID", "Passport"] as const;

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","PR","VI","GU",
] as const;

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Principal {
  name: string;
  title: string;
  percentOwned: string;
  phone: string;
  email: string;
  dob: string; // YYYY-MM-DD
  ssn: string; // digits only, 9
  idType: string;
  idState: string;
  address: Address;
}

export interface Application {
  company: {
    dba: string;
    legalName: string;
    legalSameAsDba: "yes" | "no" | "";
    location: Address;
    billingSameAsLocation: boolean;
    billing: Address;
    contactName: string;
    contactEmail: string;
    phone: string;
    mobile: string;
    billingContactName: string;
    billingContactEmail: string;
    countryOfFormation: string;
    federalTaxId: string; // digits only, 9
    businessType: string;
    llcTaxClass: string;
    siteType: string;
    siteTypeOther: string;
    yearEstablished: string;
    yearsInBusiness: string;
    annualRevenue: string;
    employees: string;
  };
  principals: Principal[];
  business: {
    description: string;
    currentProcessor: string;
    currentGateway: string;
    website: string;
    pctSwipe: string;
    pctInternet: string;
    pctMoto: string;
    monthlyVolume: string;
    averageTicket: string;
    highestTicket: string;
    products: string;
    industryAssociation: "yes" | "no" | "";
    industryAssociationName: string;
  };
  bank: {
    bankName: string;
    routing: string; // digits only, 9
    account: string; // digits only
    accountConfirm: string;
  };
  signature: {
    accurate: boolean;
    authorize: boolean;
    name: string;
    title: string;
  };
  /** Set by the client when the form is first opened; used for a bot timing check. */
  startedAt: number;
}

export const emptyAddress = (): Address => ({ street: "", city: "", state: "", zip: "", country: "United States" });

export const emptyPrincipal = (): Principal => ({
  name: "",
  title: "",
  percentOwned: "",
  phone: "",
  email: "",
  dob: "",
  ssn: "",
  idType: "",
  idState: "",
  address: emptyAddress(),
});

export const emptyApplication = (): Application => ({
  company: {
    dba: "",
    legalName: "",
    legalSameAsDba: "",
    location: emptyAddress(),
    billingSameAsLocation: true,
    billing: emptyAddress(),
    contactName: "",
    contactEmail: "",
    phone: "",
    mobile: "",
    billingContactName: "",
    billingContactEmail: "",
    countryOfFormation: "United States",
    federalTaxId: "",
    businessType: "",
    llcTaxClass: "",
    siteType: "",
    siteTypeOther: "",
    yearEstablished: "",
    yearsInBusiness: "",
    annualRevenue: "",
    employees: "",
  },
  principals: [emptyPrincipal()],
  business: {
    description: "",
    currentProcessor: "",
    currentGateway: "",
    website: "",
    pctSwipe: "",
    pctInternet: "",
    pctMoto: "",
    monthlyVolume: "",
    averageTicket: "",
    highestTicket: "",
    products: "",
    industryAssociation: "",
    industryAssociationName: "",
  },
  bank: { bankName: "", routing: "", account: "", accountConfirm: "" },
  signature: { accurate: false, authorize: false, name: "", title: "" },
  startedAt: 0,
});

// ── Helpers ──────────────────────────────────────────────────────────────────

export const digits = (s: string) => (s || "").replace(/\D/g, "");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isEmail = (s: string) => EMAIL_RE.test((s || "").trim());
export const isFilled = (s: string) => (s || "").trim().length > 0;
const num = (s: string) => Number(String(s ?? "").replace(/[^0-9.\-]/g, ""));

/** ABA routing number check digit (mod-10 weighted 3-7-1). */
export function isValidRouting(r: string): boolean {
  const d = digits(r);
  if (d.length !== 9) return false;
  const w = [3, 7, 1, 3, 7, 1, 3, 7, 1];
  const sum = d.split("").reduce((acc, ch, i) => acc + Number(ch) * w[i], 0);
  return sum % 10 === 0;
}

export function isValidSsn(s: string): boolean {
  const d = digits(s);
  if (d.length !== 9) return false;
  const area = d.slice(0, 3), group = d.slice(3, 5), serial = d.slice(5);
  if (area === "000" || area === "666" || area >= "900") return false;
  if (group === "00" || serial === "0000") return false;
  return true;
}

export function isValidEin(s: string): boolean {
  return digits(s).length === 9;
}

export function isAdult(dob: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob || "");
  if (!m) return false;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  const age = now.getFullYear() - d.getFullYear() - (now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
  return age >= 18 && age < 120;
}

// ── Formatting (display) ────────────────────────────────────────────────────

export const fmtPhone = (s: string) => {
  const d = digits(s).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};
export const fmtSsn = (s: string) => {
  const d = digits(s).slice(0, 9);
  if (d.length < 4) return d;
  if (d.length < 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
};
export const fmtEin = (s: string) => {
  const d = digits(s).slice(0, 9);
  return d.length < 3 ? d : `${d.slice(0, 2)}-${d.slice(2)}`;
};
export const maskSsn = (s: string) => (digits(s).length === 9 ? `•••-••-${digits(s).slice(-4)}` : "—");
export const maskAccount = (s: string) => (digits(s).length >= 4 ? `••••${digits(s).slice(-4)}` : "—");
export const maskEin = (s: string) => (digits(s).length === 9 ? `••-•••${digits(s).slice(-4)}` : "—");

// ── Validation ──────────────────────────────────────────────────────────────

/** Errors keyed by dotted path, e.g. "company.dba" or "principals.0.ssn". */
export type Errors = Record<string, string>;

function validateAddress(a: Address, key: string, e: Errors, label: string) {
  if (!isFilled(a.street)) e[`${key}.street`] = `${label} street address is required.`;
  if (!isFilled(a.city)) e[`${key}.city`] = "City is required.";
  if (!isFilled(a.state)) e[`${key}.state`] = "State is required.";
  if (!isFilled(a.zip)) e[`${key}.zip`] = "ZIP / postal code is required.";
}

export function validateStep(app: Application, step: StepKey): Errors {
  const e: Errors = {};
  const c = app.company;
  switch (step) {
    case "company": {
      if (!isFilled(c.dba)) e["company.dba"] = "Merchant (DBA) name is required.";
      if (!isFilled(c.legalName)) e["company.legalName"] = "Legal name is required.";
      if (!c.legalSameAsDba) e["company.legalSameAsDba"] = "Please answer yes or no.";
      validateAddress(c.location, "company.location", e, "Location");
      if (!c.billingSameAsLocation) validateAddress(c.billing, "company.billing", e, "Billing");
      if (!isFilled(c.contactName)) e["company.contactName"] = "Contact name is required.";
      if (!isEmail(c.contactEmail)) e["company.contactEmail"] = "Enter a valid email address.";
      if (digits(c.phone).length < 10) e["company.phone"] = "Enter a 10-digit phone number.";
      if (isFilled(c.mobile) && digits(c.mobile).length < 10) e["company.mobile"] = "Enter a 10-digit phone number.";
      if (isFilled(c.billingContactEmail) && !isEmail(c.billingContactEmail)) e["company.billingContactEmail"] = "Enter a valid email address.";
      if (!isValidEin(c.federalTaxId)) e["company.federalTaxId"] = "Enter a 9-digit Federal Tax ID (EIN), or your SSN if you are a sole proprietor.";
      if (!isFilled(c.businessType)) e["company.businessType"] = "Select a business type.";
      if (c.businessType.startsWith("LLC") && !isFilled(c.llcTaxClass)) e["company.llcTaxClass"] = "Select how the LLC is taxed.";
      if (!isFilled(c.siteType)) e["company.siteType"] = "Select a location type.";
      if (c.siteType === "Other" && !isFilled(c.siteTypeOther)) e["company.siteTypeOther"] = "Describe the location.";
      const y = num(c.yearEstablished);
      const thisYear = new Date().getFullYear();
      if (!(y >= 1800 && y <= thisYear)) e["company.yearEstablished"] = "Enter a 4-digit year.";
      if (!isFilled(c.annualRevenue)) e["company.annualRevenue"] = "Annual revenue is required.";
      if (!isFilled(c.employees)) e["company.employees"] = "Number of employees is required.";
      break;
    }
    case "owners": {
      if (app.principals.length === 0) e["principals"] = "At least one owner is required.";
      let total = 0;
      app.principals.forEach((p, i) => {
        const k = `principals.${i}`;
        if (!isFilled(p.name)) e[`${k}.name`] = "Full legal name is required.";
        if (!isFilled(p.title)) e[`${k}.title`] = "Title is required.";
        const pct = num(p.percentOwned);
        if (!(pct > 0 && pct <= 100)) e[`${k}.percentOwned`] = "Enter a percentage between 1 and 100.";
        else total += pct;
        if (digits(p.phone).length < 10) e[`${k}.phone`] = "Enter a 10-digit phone number.";
        if (!isEmail(p.email)) e[`${k}.email`] = "Enter a valid email address.";
        if (!isAdult(p.dob)) e[`${k}.dob`] = "Enter a valid date of birth (owner must be 18+).";
        if (!isValidSsn(p.ssn)) e[`${k}.ssn`] = "Enter a valid 9-digit Social Security number.";
        if (!isFilled(p.idType)) e[`${k}.idType`] = "Select an ID type.";
        if (!isFilled(p.idState)) e[`${k}.idState`] = "Enter the issuing state or country.";
        validateAddress(p.address, `${k}.address`, e, "Home");
      });
      if (app.principals.length > 0 && total < 50) e["principals"] = `Listed owners total ${total}% — please add owners until at least 50% of the business is represented.`;
      if (total > 100) e["principals"] = `Ownership totals ${total}% — it can’t exceed 100%.`;
      break;
    }
    case "business": {
      const b = app.business;
      if (!isFilled(b.description)) e["business.description"] = "Tell us a little about the company.";
      if (isFilled(b.website) && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(b.website.trim())) e["business.website"] = "Enter a valid website address.";
      const mix = num(b.pctSwipe || "0") + num(b.pctInternet || "0") + num(b.pctMoto || "0");
      if (Math.round(mix) !== 100) e["business.mix"] = `Card-present, online and phone/mail must add up to 100% (currently ${Math.round(mix)}%).`;
      if (!(num(b.monthlyVolume) > 0)) e["business.monthlyVolume"] = "Estimated monthly volume is required.";
      if (!(num(b.averageTicket) > 0)) e["business.averageTicket"] = "Average ticket is required.";
      if (!(num(b.highestTicket) > 0)) e["business.highestTicket"] = "Highest ticket is required.";
      if (num(b.highestTicket) > 0 && num(b.averageTicket) > num(b.highestTicket)) e["business.highestTicket"] = "Highest ticket should be at least the average ticket.";
      if (!isFilled(b.products)) e["business.products"] = "Describe the products or services you sell.";
      if (!b.industryAssociation) e["business.industryAssociation"] = "Please answer yes or no.";
      if (b.industryAssociation === "yes" && !isFilled(b.industryAssociationName)) e["business.industryAssociationName"] = "Which association?";
      break;
    }
    case "bank": {
      const k = app.bank;
      if (!isFilled(k.bankName)) e["bank.bankName"] = "Bank name is required.";
      if (!isValidRouting(k.routing)) e["bank.routing"] = "Enter a valid 9-digit ABA routing number.";
      const acct = digits(k.account);
      if (acct.length < 4 || acct.length > 17) e["bank.account"] = "Enter the account number (4–17 digits).";
      if (acct !== digits(k.accountConfirm)) e["bank.accountConfirm"] = "Account numbers don’t match.";
      break;
    }
    case "documents":
      break;
    case "review": {
      const s = app.signature;
      if (!s.accurate) e["signature.accurate"] = "Please confirm the information is accurate.";
      if (!s.authorize) e["signature.authorize"] = "Please confirm the authorization.";
      if (!isFilled(s.name) || s.name.trim().length < 3) e["signature.name"] = "Type your full name to sign.";
      if (!isFilled(s.title)) e["signature.title"] = "Your title is required.";
      break;
    }
  }
  return e;
}

export const STEPS = [
  { key: "company", label: "Company" },
  { key: "owners", label: "Ownership" },
  { key: "business", label: "Business" },
  { key: "bank", label: "Banking" },
  { key: "documents", label: "Documents" },
  { key: "review", label: "Review & sign" },
] as const;
export type StepKey = (typeof STEPS)[number]["key"];

export function validateAll(app: Application): Errors {
  return STEPS.reduce<Errors>((acc, s) => Object.assign(acc, validateStep(app, s.key)), {});
}

/** Documents the applicant can attach. Images are embedded into the encrypted PDF; PDFs ride along as attachments. */
export const DOCUMENT_SLOTS = [
  { key: "voidedCheck", label: "Voided check", hint: "A photo of a voided check from the account above. Must show the business name.", accept: "image/*", required: false },
  { key: "ownerId", label: "Owner photo ID", hint: "Driver's license or passport for each owner listed. Front only.", accept: "image/*", multiple: true, required: false },
  { key: "statements", label: "Recent processing statements", hint: "Your last 3 monthly statements if you currently accept cards.", accept: ".pdf,image/*", multiple: true, required: false },
  { key: "other", label: "Other documents", hint: "Articles of incorporation, business license, 501(c)(3) letter — if you have them handy.", accept: ".pdf,image/*", multiple: true, required: false },
] as const;
export type DocumentKey = (typeof DOCUMENT_SLOTS)[number]["key"];

export const MAX_FILE_BYTES = 4 * 1024 * 1024; // per file, after client-side compression
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024; // whole submission (Vercel request limit is 4.5 MB)
export const MAX_FILES = 10;

/** Strip sensitive values before anything is persisted client-side (draft) or logged. */
export function redactForDraft(app: Application): Application {
  return {
    ...app,
    principals: app.principals.map((p) => ({ ...p, ssn: "", dob: "" })),
    bank: { ...app.bank, routing: "", account: "", accountConfirm: "" },
    company: { ...app.company, federalTaxId: "" },
    signature: { ...app.signature, accurate: false, authorize: false, name: "" },
  };
}
