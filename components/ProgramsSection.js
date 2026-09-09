"use client";

import { useState, useMemo } from "react";
import { Sparkles, Video } from "lucide-react";
import { ProgramCard } from "@/components/ProgramCard";
import { ProgramVideoModal } from "@/components/ProgramVideoModal";
import { Button } from "@/components/ui/button";

/**
 * @param {{
 *   programs: import("@/data/site-data").TrainingProgram[],
 * }} props
 */
export function ProgramsSection({ programs }) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeVideoProgram, setActiveVideoProgram] = useState(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const list = ["ALL"];
    programs.forEach((p) => {
      if (p.category && !list.includes(p.category)) {
        list.push(p.category);
      }
    });
    return list;
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    if (selectedCategory === "ALL") return programs;
    return programs.filter((p) => p.category === selectedCategory);
  }, [programs, selectedCategory]);

  return (
    <section id="programs" className="container py-16 sm:py-24">
      {/* Section Header */}
      <div className="mx-auto max-w-2xl text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Specialized Workouts</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-foreground">
          Training Programs
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Engineered for rapid strength gains, fat loss, athletic conditioning,
          and injury prevention. Click any program to preview video
          demonstrations.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <Button
              key={cat}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? "shadow-md shadow-primary/25"
                  : "border-border/80 bg-card/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </Button>
          );
        })}
      </div>

      {/* Program Cards Grid */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPrograms.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onWatchVideo={(prog) => setActiveVideoProgram(prog)}
          />
        ))}
      </div>

      {/* Video Demo Badge Note */}
      <div className="mt-12 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
        <Video className="h-4 w-4 text-primary" />
        <span>
          All training programs feature video demonstrations & coach-guided form
          cues.
        </span>
      </div>

      {/* YouTube Player Modal */}
      <ProgramVideoModal
        program={activeVideoProgram}
        isOpen={Boolean(activeVideoProgram)}
        onClose={() => setActiveVideoProgram(null)}
      />
    </section>
  );
}
