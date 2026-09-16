import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FEES, feeBySlug } from "@/app/lib/fees";
import { loadPhotos } from "@/app/lib/photos";
import { FeePage } from "../FeePage";

export function generateStaticParams() {
  return FEES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const fee = feeBySlug(slug);
  if (!fee) return {};
  const verb = fee.verdict === "avoidable" ? "how to remove it" : fee.verdict === "markup" ? "what's fair" : "why you pay it";
  const title = `${fee.label}: what it is and ${verb} | 321 Swipe`;
  const description = fee.plainEnglish.split(". ").slice(0, 2).join(". ") + ".";
  return {
    title,
    description,
    alternates: { canonical: `https://321swipe.com/fees/${fee.slug}` },
    openGraph: { title, description, url: `https://321swipe.com/fees/${fee.slug}`, type: "article" },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fee = feeBySlug(slug);
  if (!fee) notFound();
  return <FeePage fee={fee} photos={loadPhotos()} />;
}
