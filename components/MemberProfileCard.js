import {
  CalendarDays,
  IndianRupee,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function MemberProfileCard({ member }) {
  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const statusClass =
    member.status === "active"
      ? "bg-emerald-500/15 text-emerald-600"
      : member.status === "pending"
        ? "bg-amber-500/15 text-amber-600"
        : "bg-rose-500/15 text-rose-600";

  return (
    <Card className="h-full border-border/80 bg-card/80 shadow-sm transition-transform hover:-translate-y-0.5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-foreground">{member.name}</p>
              <p className="text-xs text-muted-foreground">#{member.id}</p>
            </div>
          </div>

          <span
            className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${statusClass}`}
          >
            {member.status}
          </span>
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{member.phone}</span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{member.plan}</span>
          </div>

          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{member.fee ?? "₹0"}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Due: {member.dueDate}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
            Active member
          </div>
          <Button variant="outline" size="sm">
            View profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
