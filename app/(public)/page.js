import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ProgramsSection } from "@/components/ProgramsSection";
import { PricingSection } from "@/components/PricingSection";
import { BmiCalculator } from "@/components/BmiCalculator";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { LocationSection } from "@/components/LocationSection";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { trainingPrograms } from "@/data/site-data";

export const metadata = {
  title: "The Max Fitness Gym | Premier Strength & Training Facility in Kanpur",
  description:
    "Train to your max with Olympic lifting, cardio conditioning, combat drills, and expert coaching at Daheli Sujanpur, Kanpur.",
};

export default function HomePage() {
  return (
    <>
      {/* Hero with dynamic stats & CTAs */}
      <HeroSection />

      {/* Gym Features & Highlights */}
      <FeaturesSection />

      {/* Specialized Training Programs with YouTube Video Demos */}
      <ProgramsSection programs={trainingPrograms} />

      {/* Transparent Membership Plans */}
      <PricingSection />

      {/* Interactive BMI & Health Assessment */}
      <section className="border-y border-border bg-card/40 py-16 sm:py-24">
        <div className="container">
          <BmiCalculator />
        </div>
      </section>

      {/* Real Kanpur Member Testimonials */}
      <TestimonialsSection />

      {/* Operating Hours, Directions & Map */}
      <LocationSection />

      {/* Quick WhatsApp Floating Contact */}
      <FloatingWhatsApp />
    </>
  );
}
