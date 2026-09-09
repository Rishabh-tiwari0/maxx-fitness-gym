"use client";

import { MessageCircle } from "lucide-react";
import { brand } from "@/data/site-data";

export function FloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
    "Hi! I visited The Max Fitness Gym website and would like to learn more about memberships."
  )}`;

  return (
    <aside
      aria-label="Instant WhatsApp Assistance"
      className="fixed bottom-6 right-6 z-50 flex items-center group"
    >
      <span className="mr-3 hidden rounded-full bg-card/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-lg border border-border sm:inline-block transition-opacity duration-300 opacity-90 group-hover:opacity-100">
        Chat with Gym
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30 transition-transform duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label="Chat with The Max Fitness Gym on WhatsApp"
      >
        <MessageCircle className="h-7 w-7 fill-white" />
      </a>
    </aside>
  );
}
