import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  active: { label: "Active", variant: "secondary" },
  pending: { label: "Pending", variant: "outline" },
  expired: { label: "Expired", variant: "destructive" },
};

/**
 * Membership status pill, styled per status.
 * @param {{ status: "active"|"pending"|"expired", className?: string }} props
 */
export function StatusBadge({ status, className }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
