import type { Metadata } from "next";
import { LegalPage } from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | 321 Swipe",
  description: "What 321 Swipe collects when you use 321swipe.com, request a statement review or contact a rep, how it is used, who sees it, and the choices you have.",
  alternates: { canonical: "https://321swipe.com/privacy" },
};

/*
 * DRAFT for internal review. Items in [brackets] need a decision or a fact from
 * 321 Swipe before this goes live. This is a plain-language policy written from
 * how the site actually works today (forms, chat, upload portal, hosting); it is
 * not legal advice and should be reviewed by counsel.
 */

const COMPANY = "321 Swipe"; // [Legal entity name, e.g. "321 Swipe LLC"]
const CONTACT_EMAIL = "sales@321swipe.com";
const ADDRESS = "13227 Palmers Creek Ter, Sarasota, FL 34202";
const UPDATED = "September 18, 2026";

export default function Page() {
  return (
    <LegalPage
      label="Privacy"
      title="Privacy Policy"
      updated={UPDATED}
      intro={`This policy explains what ${COMPANY} collects when you visit 321swipe.com, send us a statement, fill out a form or chat with us — and what we do with it. We wrote it to be read, not skimmed. If anything here is unclear, ask us.`}
      sibling={{ label: "Terms of Use", href: "/terms" }}
      sections={[
        {
          id: "who",
          title: "Who we are",
          body: (
            <>
              <p>
                {COMPANY} is an independent payment advisory and processing partner for home-service contractors and other small
                businesses. We review merchant processing statements, help businesses understand and reduce their card-acceptance
                costs, and, where a business chooses, set up processing through our partner processors and banks.
              </p>
              <p>
                This policy covers the website at 321swipe.com, including pages for individual 321 Swipe representatives (for example,
                321swipe.com/savingsbycaryn) and our partner pages. It does not cover the merchant agreement you sign if you become a
                processing customer; that agreement and the processor&apos;s own privacy notice govern your processing account.
              </p>
              <p>
                You can reach us about anything in this policy at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or by mail at {ADDRESS}.
              </p>
            </>
          ),
        },
        {
          id: "collect",
          title: "What we collect",
          body: (
            <>
              <p><strong>Information you give us.</strong> When you request a statement review, contact a representative or use the chat, we collect what you enter: typically your name, business name, email address, phone number, your current processor, and any message you write.</p>
              <p><strong>Processing statements.</strong> If you send us a merchant statement — through the upload portal, a rep&apos;s contact form or by email — we receive whatever is on that document. Statements usually include your business name and address, your merchant ID, monthly card volume and transaction counts, and the fees you were charged. They should not include customer card numbers, and we ask that you never send full card numbers or bank account numbers with a statement. If a statement contains them, we redact or delete it.</p>
              <p><strong>Merchant application.</strong> If you apply for a processing account, the online application collects what a processor and its sponsor bank need to open one: ownership details, tax ID, and the business bank account for deposits. The application is submitted over HTTPS, sensitive fields are redacted from saved drafts, and the generated application document is encrypted. We share it only with Elavon and its sponsor bank for underwriting.</p>
              <p><strong>Information collected automatically.</strong> Like most websites, our hosting provider records basic technical information when you visit: your IP address, browser type, the pages you view and the time of your visit. The live-chat widget we use also sets cookies so that a conversation can continue across pages. We also use Vercel Web Analytics, a privacy-focused measurement tool that counts page views and which site features are used (for example, which fees people look up in the Statement Decoder). It does not use cookies, does not track you across other sites, and does not collect your name, email or statement contents. We do not run advertising trackers and we do not sell any of this information.</p>
              <p><strong>Information from partners.</strong> If you reach us through a partner organization such as CertainPath or Blue Collar Success Group, that partner may tell us you are a member so that we can apply the member program. We do not receive your account details from partners.</p>
            </>
          ),
        },
        {
          id: "use",
          title: "How we use it",
          body: (
            <>
              <p>We use what you send us for the reason you sent it: to review your statement, answer your question, prepare a proposal, or set up processing if you decide to move forward. Specifically, we use your information to:</p>
              <ul>
                <li>analyze your processing costs and prepare a written or verbal review;</li>
                <li>contact you about that review by email, phone or text, using the details you gave us;</li>
                <li>if you become a customer, board your account with a partner processor and service it afterward;</li>
                <li>run and secure the website and respond to support requests;</li>
                <li>understand which pages and tools on the site are useful, in aggregate.</li>
              </ul>
              <p>We do not use your statement data for advertising, and we do not build marketing profiles from it. If we ever want to use an anonymized version of a review as an example (for instance, on our Statement Decoder), we remove every identifying detail first or ask your permission.</p>
            </>
          ),
        },
        {
          id: "share",
          title: "Who sees it",
          body: (
            <>
              <p>Your information is seen by the 321 Swipe people who work on your review or account, including the representative whose page you used. Beyond that, we share it only with:</p>
              <ul>
                <li><strong>Service providers</strong> that run parts of the site for us: our hosting provider (Vercel), the form-delivery services that route contact-form submissions to our inboxes (Web3Forms and FormSubmit), our live-chat provider (Tawk.to), our email provider, and the secure upload portal at upload.321swipe.com. Each receives only what it needs to do its job.</li>
                <li><strong>Partner processors and banks</strong>, but only when you ask us to set up or price a processing account. They will have their own agreements and privacy notices.</li>
                <li><strong>Partner organizations</strong> such as CertainPath or Blue Collar Success Group, limited to confirming that a member used the program, and only where that is part of the member benefit. We do not share your statement, pricing or account details with partner organizations.</li>
                <li><strong>Authorities</strong>, if we are legally required to, or to protect the rights and safety of 321 Swipe, our customers or others.</li>
              </ul>
              <p>We do not sell personal information, and we do not share it with third parties for their own marketing.</p>
            </>
          ),
        },
        {
          id: "retention",
          title: "How long we keep it",
          body: (
            <>
              <p>If you request a review and do not become a customer, we keep your statement and contact details for 12 months so we can follow up and answer questions about the review, then delete the statement. If you become a customer, we keep records for as long as your account is open and for the period our processor and banking partners require afterward, which is typically seven years for financial records.</p>
              <p>You can ask us to delete a statement or your contact details sooner at any time (see &ldquo;Your choices&rdquo; below), and we will, unless we are required to keep it.</p>
            </>
          ),
        },
        {
          id: "security",
          title: "How we protect it",
          body: (
            <>
              <p>Statements are stored in access-controlled systems, and we limit who at 321 Swipe can open them. The site and its forms use HTTPS. We ask you to send statements through the upload portal or a rep&apos;s form rather than posting them in the chat, and never to send full card or bank account numbers by email or chat. Banking details belong only in the secure merchant application.</p>
              <p>No method of transmission or storage is perfectly secure, and we cannot promise that. If we learn of a breach affecting your information, we will tell you as the law requires.</p>
            </>
          ),
        },
        {
          id: "choices",
          title: "Your choices",
          body: (
            <>
              <p>You can ask us at any time to show you what we hold about you, correct it, delete it, or stop contacting you. Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will respond within 30 days. We will need to confirm it is you before acting on a request that involves a statement.</p>
              <p>You can decline the live-chat cookies by not using the chat, or by blocking cookies in your browser; the rest of the site works without them. Our analytics are cookie-free and anonymous, so there is nothing to opt out of there. You can opt out of marketing email using the unsubscribe link in any message, or by telling us. We will still send you messages about a review or account you have asked for.</p>
              <p>If you are a California resident, the rights above cover what the California Consumer Privacy Act requires, including the right to know, delete and correct, and the right not to be discriminated against for exercising them. We do not sell or share personal information as those terms are defined in that law.</p>
            </>
          ),
        },
        {
          id: "children",
          title: "Children",
          body: <p>Our services are for businesses. We do not knowingly collect information from anyone under 18, and if we learn that we have, we delete it.</p>,
        },
        {
          id: "changes",
          title: "Changes to this policy",
          body: (
            <p>If we change how we handle your information, we will update this page and the date at the top. For a significant change — for instance, a new category of sharing — we will also note it on this page for at least 30 days.</p>
          ),
        },
        {
          id: "contact",
          title: "Contact",
          body: (
            <p>
              Questions, requests or complaints about privacy: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or {COMPANY}, {ADDRESS}.
            </p>
          ),
        },
      ]}
    />
  );
}
