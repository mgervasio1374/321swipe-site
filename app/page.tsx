import { Navbar } from "@/app/components/navigation/Navbar";
import { HeroSection } from "@/app/components/hero/HeroSection";
import { ProblemSection } from "@/app/components/sections/ProblemSection";
import { IntelligenceSection } from "@/app/components/sections/IntelligenceSection";
import { DiagnosticSection } from "@/app/components/sections/DiagnosticSection";
import { PartnershipSection } from "@/app/components/sections/PartnershipSection";
import { AdvantageSection } from "@/app/components/sections/AdvantageSection";
import { ServicesSection } from "@/app/components/sections/ServicesSection";
import { CtaSection } from "@/app/components/sections/CtaSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <IntelligenceSection />
        <DiagnosticSection />
        <PartnershipSection />
        <AdvantageSection />
        <ServicesSection />
        <CtaSection />
      </main>
    </>
  );
}
