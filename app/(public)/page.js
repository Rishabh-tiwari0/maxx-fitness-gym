import { HeroSection } from "@/components/HeroSection";
import { ProgramCard } from "@/components/ProgramCard";
import { BmiCalculator } from "@/components/BmiCalculator";
import { LocationSection } from "@/components/LocationSection";
import { trainingPrograms } from "@/data/site-data";

export const metadata = {
  title: "Membership & Training",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section id="programs" className="container py-16">
        <h2 className="text-center font-display text-2xl font-extrabold uppercase tracking-tight">
          Training Programs
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trainingPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </section>

      <section className="container pb-16">
        <BmiCalculator />
      </section>

      <LocationSection />
    </>
  );
}
