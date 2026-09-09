"use client";

import Image from "next/image";
import { Play, Flame, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * @param {{
 *   program: import("@/data/site-data").TrainingProgram,
 *   onWatchVideo?: (program: import("@/data/site-data").TrainingProgram) => void,
 * }} props
 */
export function ProgramCard({ program, onWatchVideo }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
      {/* Visual Image Banner with Play Overlay */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={program.imageUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800"}
          alt={program.imageAlt || program.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />

        {/* Cinematic Gradient Overlays */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20"
          aria-hidden="true"
        />

        {/* Top Badges */}
        <div className="absolute left-3.5 right-3.5 top-3.5 flex items-center justify-between gap-2">
          <Badge
            variant={program.tagVariant === "accent" ? "default" : "secondary"}
            className="font-bold tracking-wider text-[11px] shadow-sm uppercase backdrop-blur-md"
          >
            {program.category}
          </Badge>

          {program.duration && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
              <Clock className="h-3 w-3 text-primary" />
              {program.duration}
            </span>
          )}
        </div>

        {/* Center Hover Play Button for YouTube Demo */}
        {program.youtubeId && (
          <button
            type="button"
            onClick={() => onWatchVideo?.(program)}
            className="absolute inset-0 flex items-center justify-center opacity-90 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
            aria-label={`Watch ${program.title} video demo`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 ring-4 ring-black/40">
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </div>
          </button>
        )}

        {/* Bottom Banner Tag */}
        {program.intensity && (
          <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-xs font-semibold text-white/90">
            <Flame className="h-3.5 w-3.5 text-rose-500" />
            <span>{program.intensity}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div className="space-y-2">
          <h3 className="font-display text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {program.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {program.description}
          </p>
        </div>

        {/* Highlights List */}
        {program.highlights && program.highlights.length > 0 && (
          <ul className="space-y-1.5 pt-2 border-t border-border/60 text-xs text-muted-foreground">
            {program.highlights.slice(0, 2).map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span className="line-clamp-1">{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Watch Demo CTA */}
        {program.youtubeId && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onWatchVideo?.(program)}
            className="w-full gap-2 border-border/80 bg-secondary/30 font-semibold text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Watch Video Demo
          </Button>
        )}
      </div>
    </article>
  );
}
