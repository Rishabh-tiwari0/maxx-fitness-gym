import { Camera, Globe, Send } from "lucide-react";

import { brand, footer as footerData } from "@/data/site-data";

const ICONS = {
  facebook: Globe,
  instagram: Camera,
  twitter: Send,
};

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-card">
      <div className="container flex flex-col items-center gap-4 py-10 text-center">
        <p className="font-display text-xl font-extrabold uppercase tracking-tight text-primary">
          {brand.name}
        </p>
        <p className="text-sm text-muted-foreground">
          © {year} {brand.name}. {footerData.tagline}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {footerData.socialLinks.map((link) => {
            const Icon = ICONS[link.icon];
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {link.label}
              </a>
            );
          })}
          <a
            href={footerData.contactHref}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
