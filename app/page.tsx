import type { Metadata } from "next";
import { Navbar } from "@/app/components/navigation/Navbar";
import { HeroSection } from "@/app/components/hero/HeroSection";
import { TradesMarquee } from "@/app/components/sections/TradesMarquee";
import { ProblemSection } from "@/app/components/sections/ProblemSection";
import { IntelligenceSection } from "@/app/components/sections/IntelligenceSection";
import { DiagnosticSection } from "@/app/components/sections/DiagnosticSection";
import { PartnershipSection } from "@/app/components/sections/PartnershipSection";
import { AdvantageSection } from "@/app/components/sections/AdvantageSection";
import { ServicesSection } from "@/app/components/sections/ServicesSection";
import { AdvisorySection } from "@/app/components/sections/AdvisorySection";
import { CtaSection } from "@/app/components/sections/CtaSection";
import { loadPhotos } from "@/app/lib/photos";

export const metadata: Metadata = {
  alternates: { canonical: "https://321swipe.com/" },
};

export default function Home() {
  // Resolved at build time: real photo from /public/photos, or null → placeholder.
  const photos = loadPhotos();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection photo={photos.hero} />
        <TradesMarquee />
        <ProblemSection photo={photos.problem} />
        <IntelligenceSection photo={photos.analyst} />
        <DiagnosticSection photo={photos.statement} />
        <PartnershipSection advisorPhoto={photos.advisor} tailgatePhoto={photos["van-tailgate"]} />
        <AdvantageSection photo={photos["roofing-crew"]} />
        <ServicesSection statementPhoto={photos.analyst} porchPhoto={photos["porch-payment"]} />
        <AdvisorySection photo={photos.analyst} />
        <CtaSection photo={photos["van-dusk"]} />
      </main>
    </>
  );
}
