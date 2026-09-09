import { Dumbbell, Zap, ShieldAlert, Users, Award } from "lucide-react";
import { gymFeatures } from "@/data/site-data";

const ICON_MAP = {
  Dumbbell: Dumbbell,
  Zap: Zap,
  ShieldAlert: ShieldAlert,
  Users: Users,
};

export function FeaturesSection() {
  return (
    <section id="features" className="border-b border-border bg-card/40 py-16 sm:py-24">
      <div className="container space-y-12">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Award className="h-3.5 w-3.5" />
            <span>Why The Max Fitness</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-foreground">
            Built For Serious Transformations
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            We reject crowded gym gimmicks. Everything here is curated to maximize your performance, recovery, and results.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {gymFeatures.map((feat) => {
            const Icon = ICON_MAP[feat.icon] || Dumbbell;
            return (
              <div
                key={feat.id}
                className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Glow pill background */}
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                  {feat.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
