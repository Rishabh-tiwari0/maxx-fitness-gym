import { MapPin, Clock, Phone, MessageCircle, Navigation } from "lucide-react";

import { location, brand } from "@/data/site-data";
import { Button } from "@/components/ui/button";

export function LocationSection() {
  const whatsappUrl = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
    `Hi! Where is The Max Fitness Gym located? What are the best hours to visit for a trial?`
  )}`;

  return (
    <section id="location" className="container py-16 sm:py-24">
      {/* Section Header */}
      <div className="mx-auto max-w-2xl text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <MapPin className="h-3.5 w-3.5" />
          <span>Visit Us In Kanpur</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-foreground">
          {location.title}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Conveniently situated at Daheli Sujanpur, Kanpur with easy road access, ample parking, and full air-conditioned floors.
        </p>
      </div>

      {/* Grid: Details & Map */}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xl grid grid-cols-1 lg:grid-cols-12">
        {/* Left column: Address & Hours info */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Address */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Facility Address</span>
              </span>
              <p className="text-base font-semibold text-foreground leading-snug">
                {location.descriptionLabel}
              </p>
              <p className="text-xs text-muted-foreground">{location.city}</p>
            </div>

            {/* Operating Hours */}
            <div className="space-y-2.5 pt-4 border-t border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <span>Operating Hours</span>
              </span>
              <div className="space-y-2 text-xs sm:text-sm">
                {location.hours?.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-border/30 last:border-0">
                    <span className="text-muted-foreground font-medium">{h.days}</span>
                    <span className="font-bold text-foreground">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact numbers */}
            <div className="space-y-2 pt-4 border-t border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Inquiries & Trials
              </span>
              <p className="text-base font-bold text-foreground">
                {brand.phone}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              asChild
              className="flex-1 font-bold uppercase tracking-wider text-xs h-11"
            >
              <a href={location.mapUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                <Navigation className="h-4 w-4" />
                <span>Get Directions</span>
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="flex-1 border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300 font-bold uppercase tracking-wider text-xs h-11"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <MessageCircle className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                <span>WhatsApp</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Right column: Interactive Embed Map */}
        <div className="lg:col-span-7 relative min-h-[350px] lg:min-h-full w-full bg-muted border-t lg:border-t-0 lg:border-l border-border/80">
          <iframe
            title="Google map showing Maxx Fitness Gym location"
            src={location.embedMapUrl}
            className="h-full w-full border-0 absolute inset-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
