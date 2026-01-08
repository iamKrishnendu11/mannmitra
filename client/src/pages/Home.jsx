import {
  HeroSection,
  FeaturesSection,
  PricingSection,
  RewardsSection,
  CTASection,
  MannmitraIntro,
  FAQSection,
  ContactSection,
  Testimonials,
} from "../landingPage";

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <FeaturesSection />
      <MannmitraIntro />
      <PricingSection />
      <RewardsSection />
      <Testimonials />
      <FAQSection />
      <CTASection />
      <ContactSection />
    </div>
  );
}
