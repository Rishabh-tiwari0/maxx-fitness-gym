"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Flame, Clock } from "lucide-react";

/**
 * Responsive modal dialog with an embedded YouTube video player for workout demos.
 *
 * @param {{
 *   program: import("@/data/site-data").TrainingProgram | null,
 *   isOpen: boolean,
 *   onClose: () => void,
 * }} props
 */
export function ProgramVideoModal({ program, isOpen, onClose }) {
  if (!program) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl overflow-hidden p-0 rounded-2xl border-border bg-card">
        {/* Responsive 16:9 Video Container */}
        <div className="relative aspect-video w-full bg-black">
          {isOpen && program.youtubeId && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${program.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={`${program.title} Workout Video Demo`}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>

        {/* Video & Program Meta */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="uppercase font-bold tracking-wider text-[10px]">
                {program.category}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {program.duration}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <Flame className="h-3.5 w-3.5 text-rose-500" />
                {program.intensity}
              </span>
            </div>
          </div>

          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="font-display text-xl font-extrabold uppercase tracking-tight">
              {program.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {program.description}
            </DialogDescription>
          </DialogHeader>

          {/* Highlights */}
          {program.highlights && (
            <div className="pt-2 border-t border-border/70">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                What you will master:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground/90">
                {program.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
