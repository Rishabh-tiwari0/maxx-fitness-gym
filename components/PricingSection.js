import { Check, Flame, MessageCircle } from "lucide-react";
import { pricingPlans, brand } from "@/data/site-data";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  return (
    <section id="plans" className="container py-16 sm:py-24">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <Flame className="h-3.5 w-3.5" />
          <span>Transparent Memberships</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-foreground">
          Membership Plans
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          No hidden fees or unexpected registration charges. Flexible memberships to match your goals and schedule.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pricingPlans.map((plan) => {
          const whatsappUrl = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
            `Hello! I want to join The Max Fitness Gym with the ${plan.name} (₹${plan.price}). Please share how to get started!`
          )}`;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
                plan.popular
                  ? "border-primary bg-gradient-to-b from-card via-card to-primary/5 shadow-xl shadow-primary/10 ring-2 ring-primary"
                  : "border-border/80 bg-card hover:border-primary/40"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute right-0 top-0 rounded-bl-xl bg-primary px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary-foreground shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 py-2">
                  <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    ₹{plan.price}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {plan.period}
                  </span>
                </div>

                {/* Features list */}
                <ul className="space-y-2.5 pt-4 border-t border-border/60 text-xs sm:text-sm">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Button
                  asChild
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full font-bold uppercase tracking-wider text-xs h-11 ${
                    plan.popular
                      ? "shadow-md shadow-primary/30"
                      : "hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  }`}
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Join on WhatsApp</span>
                  </a>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
