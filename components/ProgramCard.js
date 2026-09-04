import Image from "next/image";

import { Badge } from "@/components/ui/badge";

/**
 * @param {{ program: import("../data/site-data").TrainingProgram }} props
 */
export function ProgramCard({ program }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={`https://picsum.photos/seed/${program.imageSeed}/640/480`}
          alt={program.imageAlt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 768px) 25vw, 100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
          aria-hidden="true"
        />
        <Badge
          variant={program.tagVariant === "accent" ? "default" : "secondary"}
          className="absolute left-3 top-3"
        >
          {program.category}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-bold">{program.title}</h3>
      </div>
    </article>
  );
}
