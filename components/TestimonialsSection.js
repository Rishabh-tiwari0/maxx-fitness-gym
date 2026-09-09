import { Star, Quote, ThumbsUp } from "lucide-react";
import { testimonials } from "@/data/site-data";
import { Badge } from "@/components/ui/badge";

export function TestimonialsSection() {
  return (
    <section className="border-t border-border bg-card/30 py-16 sm:py-24">
      <div className="container space-y-12">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>Member Stories</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-foreground">
            Proven Results in Kanpur
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Real stories from members training at Daheli Sujanpur who showed up, put in the work, and transformed their lives.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="space-y-4">
                {/* Rating Stars & Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-semibold uppercase">
                    {t.tag}
                  </Badge>
                </div>

                {/* Quote */}
                <p className="text-sm italic leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-bold text-primary">
                  {t.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
