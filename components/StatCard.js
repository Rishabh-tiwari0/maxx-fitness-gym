import { Zap } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ACCENT_BORDER = {
  none: "border-l-border",
  warning: "border-l-warning",
  danger: "border-l-primary",
};

const ICONS = {
  bolt: Zap,
};

/**
 * A single overview metric card used on the admin dashboard.
 * @param {{
 *   label: string,
 *   value: string,
 *   accent?: "none"|"warning"|"danger",
 *   icon?: "bolt"|null
 * }} props
 */
export function StatCard({ label, value, accent = "none", icon = null }) {
  const Icon = icon ? ICONS[icon] : null;
  return (
    <Card
      className={cn(
        "relative border-l-4 px-4 py-4 sm:px-5",
        ACCENT_BORDER[accent] ?? ACCENT_BORDER.none,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
          {label}
        </p>
        {Icon ? (
          <Icon
            className="h-4 w-4 shrink-0 text-muted-foreground/70"
            aria-hidden="true"
          />
        ) : null}
      </div>
      <p
        className={cn(
          "mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl",
          icon === "bolt" && "text-primary",
        )}
      >
        {value}
      </p>
    </Card>
  );
}
