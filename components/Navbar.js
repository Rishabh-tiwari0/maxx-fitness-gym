import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";

import { brand, siteNav } from "@/data/site-data";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-primary/10">
            <Image
              src="/logo.png"
              alt={`${brand.name} logo`}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </span>
          <span className="font-display text-lg font-extrabold uppercase leading-none tracking-tight text-primary">
            {brand.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {siteNav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center">
          <a
            href={`tel:${brand.phone.replace(/[^+\d]/g, "")}`}
            className="hidden items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted md:inline-flex"
            aria-label={`Call ${brand.name} at ${brand.phone}`}
          >
            <Phone className="h-4 w-4" />
            <span>{brand.phone}</span>
          </a>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="md:hidden"
            aria-label={`Call ${brand.name}`}
          >
            <a href={`tel:${brand.phone.replace(/[^+\d]/g, "")}`}>
              <Phone className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
