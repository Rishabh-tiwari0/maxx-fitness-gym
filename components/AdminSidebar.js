"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dumbbell,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  Headphones,
  LogOut,
  UserRound,
} from "lucide-react";

import { brand } from "@/data/site-data";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase/client";
import { logoutAction } from "@/app/admin/login/actions";
import { cn } from "@/lib/utils";

const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Members", href: "/admin/members", icon: UserRound },
  { label: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
  { label: "Take Payment", href: "/admin/payment", icon: CreditCard },
];

function NavLinks({ pathname, onNavigate }) {
  const router = useRouter();

  async function handleLogout() {
    // Clear the httpOnly session cookie server-side, then sign out of
    // Firebase Auth client-side too so a stale ID token can't linger.
    await logoutAction();
    await signOut(auth);
    onNavigate?.();
    router.replace("/admin/login");
  }

  return (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Admin">
      {ADMIN_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
      <a
        href="#contact"
        onClick={onNavigate}
        className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Headphones className="h-4 w-4" aria-hidden="true" />
        Contact
      </a>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Logout
      </button>
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Dumbbell className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="font-display text-base font-extrabold uppercase leading-none tracking-tight text-primary">
        {brand.shortName}
      </span>
    </div>
  );
}

/**
 * Static desktop sidebar column, shown at md and above.
 */
export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 border-r border-border bg-card p-5 md:flex">
      <Brand />
      <NavLinks pathname={pathname} />
    </aside>
  );
}

/**
 * Mobile hamburger-triggered drawer, controlled by AdminHeader.
 * @param {{ open: boolean, onOpenChange: (open: boolean) => void }} props
 */
export function AdminSidebarDrawer({ open, onOpenChange }) {
  const pathname = usePathname();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex w-72 flex-col gap-6">
        <SheetHeader>
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <Brand />
        </SheetHeader>
        <NavLinks pathname={pathname} onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
