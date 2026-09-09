import Image from "next/image";

import { hero } from "@/data/site-data";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[480px] items-center overflow-hidden border-b border-border sm:min-h-[560px]">
      <Image
        src="/hero.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40"
        aria-hidden="true"
      />
      <div className="container relative px-4 py-20 text-center sm:py-24">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
          {hero.eyebrow}
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl text-balance font-display text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-5xl">
          {hero.title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-balance text-sm text-muted-foreground sm:text-base">
          {hero.subtitle}
        </p>
        <Button
          asChild
          size="lg"
          className="glow-primary mt-8 uppercase tracking-wide"
        >
          <a href={hero.ctaHref}>{hero.ctaLabel}</a>
        </Button>
      </div>
    </section>
  );
}
