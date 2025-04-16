import BgGradient from "@/components/common/bg-gradient";
import CTAsection from "@/components/common/cta-section";
import DemoSection from "@/components/common/demo-section";
import HowItWorkSection from "@/components/common/how-it-work-section";
import PricingSection from "@/components/common/pricing-section";
import HeroSection from "@/components/home/hero-section";
import { toast } from "sonner";


export default function Home() {
  return (
    <div className=" relative w-full">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection />
        <DemoSection />
        <HowItWorkSection />
        <PricingSection />
      </div>

      <CTAsection/>
    </div>
  );
}
