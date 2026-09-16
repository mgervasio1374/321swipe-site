import type { Metadata } from "next";
import { loadPhotos } from "@/app/lib/photos";
import { CarynPage } from "./CarynPage";

export const metadata: Metadata = {
  title: "Savings by Caryn | 321 Swipe — Card Processing for Lancaster County Businesses",
  description:
    "Caryn Hales is 321 Swipe's payment advisor for Lancaster County and central Pennsylvania — farm markets, shed builders, machine shops, garages, bakeries and ministries. Send her one statement for a free line-by-line review.",
  alternates: { canonical: "https://321swipe.com/savingsbycaryn" },
  openGraph: {
    title: "Savings by Caryn | 321 Swipe",
    description: "Card processing, explained by a neighbor. Free statement review for Lancaster County and central PA businesses.",
    url: "https://321swipe.com/savingsbycaryn",
  },
};

export default function Page() {
  return <CarynPage photos={loadPhotos()} />;
}
