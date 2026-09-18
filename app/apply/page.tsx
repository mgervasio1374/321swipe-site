import type { Metadata } from "next";
import { ApplyPage } from "./ApplyPage";

export const metadata: Metadata = {
  title: "Merchant Application | 321 Swipe",
  description: "Apply for a 321 Swipe merchant account online. Takes about 10 minutes; your information is encrypted end to end.",
  alternates: { canonical: "https://321swipe.com/apply" },
  // Shared by link from sales — keep it out of search results.
  robots: { index: false, follow: false },
  openGraph: {
    title: "321 Swipe Merchant Application",
    description: "Secure online merchant application. About 10 minutes.",
    url: "https://321swipe.com/apply",
  },
};

export default function Page() {
  return <ApplyPage />;
}
