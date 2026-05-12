import { Navbar } from "@/app/components/navigation/Navbar";
import { HeroSection } from "@/app/components/hero/HeroSection";
import { ProblemSection } from "@/app/components/sections/ProblemSection";
import { AdvantageSection } from "@/app/components/sections/AdvantageSection";
import { IntelligenceSection } from "@/app/components/sections/IntelligenceSection";
import { PartnershipSection } from "@/app/components/sections/PartnershipSection";
import { SocialProofSection } from "@/app/components/sections/SocialProofSection";
import { ServicesSection } from "@/app/components/sections/ServicesSection";
import { CtaSection } from "@/app/components/sections/CtaSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <AdvantageSection />
        <IntelligenceSection />
        <PartnershipSection />
        <SocialProofSection />
        <ServicesSection />
        <CtaSection />
      </main>
    </>
  );
}
