"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * A labeled search input with a leading icon. Fully controlled.
 * @param {{
 *   value: string,
 *   onChange: (value: string) => void,
 *   placeholder?: string,
 *   ariaLabel: string,
 *   className?: string
 * }} props
 */
export function SearchBar({ value, onChange, placeholder = "Search...", ariaLabel, className }) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="pl-9"
      />
    </div>
  );
}
