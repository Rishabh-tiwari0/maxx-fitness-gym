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
        "relative border-l-4 px-5 py-4",
        ACCENT_BORDER[accent] ?? ACCENT_BORDER.none
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground/70" aria-hidden="true" /> : null}
      </div>
      <p
        className={cn(
          "mt-2 font-display text-3xl font-extrabold tracking-tight",
          icon === "bolt" && "text-primary"
        )}
      >
        {value}
      </p>
    </Card>
  );
}
