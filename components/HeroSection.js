import Image from "next/image";
import { MessageCircle, ArrowRight, Flame } from "lucide-react";

import { hero, brand } from "@/data/site-data";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const whatsappUrl = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
    "Hello! I am interested in joining The Max Fitness Gym. Can you share membership details and batch timings?"
  )}`;

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background Image & Gradient Layers */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.jpg"
          alt="Max Fitness Gym Training Atmosphere"
          fill
          priority
          className="object-cover object-center brightness-90"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background"
          aria-hidden="true"
        />
        {/* Subtle Radial Glow */}
        <div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[600px] rounded-full bg-primary/15 blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Hero Content */}
      <div className="container relative z-10 px-4 pt-20 pb-16 text-center sm:pt-28 sm:pb-20">
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur-md shadow-sm">
          <Flame className="h-4 w-4 text-primary animate-pulse" />
          <span>{hero.badge}</span>
        </div>

        {/* Impactful Title */}
        <h1 className="mx-auto mt-6 max-w-4xl text-balance font-display text-4xl font-extrabold uppercase leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
          TRAIN TO YOUR{" "}
          <span className="bg-gradient-to-r from-primary via-rose-500 to-amber-500 bg-clip-text text-transparent">
            MAX
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-balance text-sm text-muted-foreground sm:text-lg leading-relaxed">
          {hero.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto font-bold uppercase tracking-wider shadow-lg shadow-primary/30 text-sm h-12 px-8"
          >
            <a href={hero.primaryCtaHref} className="flex items-center gap-2">
              <span>{hero.primaryCtaLabel}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-emerald-500/40 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300 font-bold uppercase tracking-wider text-sm h-12 px-8 backdrop-blur-sm"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4 fill-emerald-500 text-emerald-500" />
              <span>{hero.secondaryCtaLabel}</span>
            </a>
          </Button>
        </div>

        {/* Key Facilities & Stats Ribbon */}
        {hero.stats && (
          <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-border/80 bg-card/80 p-5 backdrop-blur-md shadow-2xl">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
              {hero.stats.map((stat, idx) => (
                <div key={idx} className={`pt-2 sm:pt-0 ${idx > 0 ? "sm:pl-4" : ""}`}>
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
