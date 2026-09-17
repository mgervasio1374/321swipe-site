import type { Metadata } from "next";
import { loadPhotos } from "@/app/lib/photos";
import { GraderPage } from "./GraderPage";

export const metadata: Metadata = {
  title: "Grade My Statement | 321 Swipe — Is Your Card Processing Deal Any Good?",
  description:
    "Six quick questions about your merchant processing statement and contract. Get an A–F grade, see what's dragging it down, and share the result.",
  alternates: { canonical: "https://321swipe.com/grade-my-statement" },
  openGraph: { title: "How good is your processing deal, really?", description: "A two-minute check from 321 Swipe. Six questions, a letter grade, no statement required.", url: "https://321swipe.com/grade-my-statement" },
};

export default function Page() {
  return <GraderPage photos={loadPhotos()} />;
}
