import type { Metadata } from "next";
import { LegalPage } from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use | 321 Swipe",
  description: "The terms that apply when you use 321swipe.com, its calculators and Statement Decoder, or request a free statement review from 321 Swipe.",
  alternates: { canonical: "https://321swipe.com/terms" },
};

/*
 * DRAFT for internal review. Items in [brackets] need a decision or a fact from
 * 321 Swipe before this goes live. Written in plain language from how the site
 * actually works; not legal advice — please have counsel review, especially
 * governing law, limitation of liability and the processing-agreement carve-out.
 */

const COMPANY = "321 Swipe"; // [Legal entity name]
const CONTACT_EMAIL = "[hello@321swipe.com]";
const STATE = "[Pennsylvania]";
const UPDATED = "September 17, 2026";

export default function Page() {
  return (
    <LegalPage
      label="Terms"
      title="Terms of Use"
      updated={UPDATED}
      intro={`These terms cover your use of 321swipe.com and the free tools and reviews we offer through it. They are short on purpose. If you become a processing customer, a separate merchant agreement applies to that account.`}
      sibling={{ label: "Privacy Policy", href: "/privacy" }}
      sections={[
        {
          id: "agreement",
          title: "The basics",
          body: (
            <>
              <p>By using 321swipe.com (the &ldquo;site&rdquo;), including our representatives&apos; pages, partner pages, calculators, the Statement Decoder and fee dictionary, and by requesting a statement review, you agree to these terms and to our <a href="/privacy">Privacy Policy</a>. If you do not agree, please do not use the site.</p>
              <p>The site is operated by {COMPANY}. You can contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
              <p>These terms do not replace any merchant processing agreement, equipment agreement or advisory engagement letter you sign with {COMPANY} or with a processor or bank we introduce you to. Where those documents and these terms differ, those documents control for the account or engagement they cover.</p>
            </>
          ),
        },
        {
          id: "review",
          title: "The free statement review",
          body: (
            <>
              <p>When you send us a processing statement, we review it and tell you, in plain English, what the fees are, which ones we think are avoidable or negotiable, and what we would do about them. The review is free and there is no obligation to become a customer.</p>
              <p>A review is our professional opinion based on the statement you send and the information you give us. It is not a guarantee of savings. Actual costs depend on your card mix, ticket sizes, how transactions are accepted, the terms of any new agreement and factors outside our control, including interchange rates set by the card networks. Where we quote an estimated saving, it is an estimate.</p>
              <p>You are responsible for making sure you are allowed to share the statement with us and that it does not contain cardholder data. Please do not send full card numbers or bank account numbers.</p>
            </>
          ),
        },
        {
          id: "tools",
          title: "Calculators, the Statement Decoder and fee dictionary",
          body: (
            <>
              <p>The savings calculators, the Statement Decoder and the fee dictionary are educational tools. The Statement Decoder shows a fictional business and typical fee structures; the amounts, &ldquo;fair ranges&rdquo; and verdicts are illustrative and general, not a quote or an assessment of your account. Interchange, assessments and processor fees change over time, and we may not update every figure the moment they do.</p>
              <p>Nothing on the site is legal, tax, accounting or investment advice. For decisions about your business, rely on your own advisors and on the written terms of any agreement you sign.</p>
            </>
          ),
        },
        {
          id: "contact",
          title: "Contacting us and being contacted",
          body: (
            <>
              <p>When you submit a form, use the chat or upload a statement, you are asking us to get in touch about it. We may contact you by email, phone or text at the details you provide. Message and data rates may apply to texts, and you can tell us to stop at any time.</p>
              <p>Forms on the site are delivered through third-party services described in our Privacy Policy. We are not responsible for delays or failures in those services, but if something you sent seems not to have arrived, email us and we will sort it out.</p>
            </>
          ),
        },
        {
          id: "use",
          title: "Acceptable use",
          body: (
            <>
              <p>Please use the site only for its intended purpose. You agree not to: submit information you do not have the right to share, or that is false or misleading; send us cardholder data; use automated tools to scrape, overload or probe the site; attempt to access systems or data you are not authorized to use; or copy the site, its content or its tools for a competing service.</p>
            </>
          ),
        },
        {
          id: "ip",
          title: "Our content",
          body: (
            <>
              <p>The text, design, photographs, tools and code on the site belong to {COMPANY} or our licensors and are protected by copyright and other laws. You may read, link to and share pages for your own business purposes. You may not republish substantial parts of the site, or the Statement Decoder or fee dictionary content, without our written permission. The 321 Swipe name and logo are our trademarks. Partner names and logos belong to those partners and appear with their permission.</p>
            </>
          ),
        },
        {
          id: "third-parties",
          title: "Third-party sites and partners",
          body: (
            <>
              <p>The site links to third-party sites, including our secure upload portal, partner organizations and processors. Those sites have their own terms and privacy policies, which govern your use of them. Mentioning a partner on the site does not mean the partner endorses any particular processor or outcome.</p>
              <p>{COMPANY} is an independent sales organization / merchant services provider. Processing accounts are provided by our partner processors and their sponsor banks under their agreements. [Insert the registered ISO/MSP disclosure exactly as your processor requires it.]</p>
            </>
          ),
        },
        {
          id: "disclaimer",
          title: "Disclaimers and limitation of liability",
          body: (
            <>
              <p>The site and its tools are provided &ldquo;as is.&rdquo; We work to keep the site accurate and available, but we do not promise that it will be error-free, uninterrupted or free of viruses, or that any figure on it is current.</p>
              <p>To the fullest extent the law allows, {COMPANY} and its owners, employees and representatives will not be liable for indirect, incidental, special or consequential damages, or for lost profits or revenue, arising from your use of the site, its tools or a free review, even if we were told they were possible. Our total liability for any claim relating to the site or a free review will not exceed [one hundred dollars ($100)]. Some jurisdictions do not allow these limits, so they may not apply to you in full.</p>
              <p>This section applies to the site and free reviews. Liability for a processing account or a paid advisory engagement is set by the agreement that covers it.</p>
            </>
          ),
        },
        {
          id: "law",
          title: "Governing law and disputes",
          body: (
            <>
              <p>These terms are governed by the laws of the State of {STATE}, without regard to its conflict-of-law rules. Any dispute about the site or these terms will be brought in the state or federal courts located in [County], {STATE}, and you consent to their jurisdiction. Before filing, please write to us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> — most problems can be solved with a conversation.</p>
            </>
          ),
        },
        {
          id: "changes",
          title: "Changes",
          body: (
            <p>We may update these terms as the site changes. The date at the top shows the current version. Continuing to use the site after a change means you accept the updated terms. If you have already requested a review, the terms in effect when you requested it apply to that review.</p>
          ),
        },
      ]}
    />
  );
}
