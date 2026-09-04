import { MapPin } from "lucide-react";

import { location } from "@/data/site-data";
import { Button } from "@/components/ui/button";

export function LocationSection() {
  return (
    <section id="location" className="container py-16">
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <iframe
            title="Google map showing Maxx Fitness Gym location"
            src={location.embedMapUrl}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <div className="bg-card px-6 py-8 text-center">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight">
            {location.title}
          </h2>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            {location.descriptionLabel}
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-5 uppercase tracking-wide"
          >
            <a href={location.mapUrl} target="_blank" rel="noreferrer">
              View on Map
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
