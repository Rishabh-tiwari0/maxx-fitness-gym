"use client";

import { CalendarDays } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * A labeled native date input, styled to match the rest of the form controls.
 * @param {{
 *   value: string,
 *   onChange: (value: string) => void,
 *   max?: string,
 *   ariaLabel: string,
 *   className?: string
 * }} props
 */
export function DatePickerField({ value, onChange, max, ariaLabel, className }) {
  return (
    <div className={cn("relative", className)}>
      <CalendarDays
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="date"
        value={value}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        className="pl-9"
      />
    </div>
  );
}
