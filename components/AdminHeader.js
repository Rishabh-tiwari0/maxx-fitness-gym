"use client";

import { useState } from "react";
import Link from "next/link";
import { Dumbbell, Menu } from "lucide-react";

import { brand } from "@/data/site-data";
import { Button } from "@/components/ui/button";
import { AdminSidebarDrawer } from "@/components/AdminSidebar";

export function AdminHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Link href="/admin/dashboard" className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Dumbbell className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span className="font-display text-sm font-extrabold uppercase leading-none tracking-tight text-primary">
          {brand.name}
        </span>
      </Link>

      <a
        href="#contact"
        className="ml-auto text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
      >
        Contact
      </a>

      <AdminSidebarDrawer open={open} onOpenChange={setOpen} />
    </header>
  );
}
