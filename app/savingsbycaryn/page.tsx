import type { Metadata } from "next";
import { loadPhotos } from "@/app/lib/photos";
import { CARYN } from "@/app/lib/reps";
import { RepPage } from "@/app/components/rep/RepPage";

export const metadata: Metadata = {
  title: CARYN.metadata.title,
  description: CARYN.metadata.description,
  alternates: { canonical: `https://321swipe.com/${CARYN.slug}` },
  openGraph: { title: `${CARYN.pageName} | 321 Swipe`, description: CARYN.metadata.ogDescription, url: `https://321swipe.com/${CARYN.slug}` },
};

export default function Page() {
  return <RepPage rep={CARYN} photos={loadPhotos()} />;
}
