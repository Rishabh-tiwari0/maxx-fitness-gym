import Link from "next/link";
import { CalendarDays, Phone, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatINR, formatISODateTimeLabel, getInitials } from "@/lib/format";

/**
 * Summary card for one member, shown in the Members grid. The whole card is
 * a link to that member's details page.
 * @param {{ member: import("@/lib/firebase/members").Member }} props
 */
export function MemberCard({ member }) {
  const hasPending = (member.pendingAmount ?? 0) > 0;

  return (
    <Link href={`/admin/members/${member.memberId}`} className="block">
      <Card className="h-full border-border/80 bg-card/80 shadow-sm transition-transform hover:-translate-y-0.5 hover:border-primary/40">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                {getInitials(member.name || "?")}
              </div>
              <div>
                <p className="font-semibold text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground">
                  #{member.memberId}
                </p>
              </div>
            </div>

            {hasPending ? (
              <span className="rounded-full bg-rose-500/15 px-2 py-1 text-[10px] font-semibold uppercase text-rose-600">
                Due {formatINR(member.pendingAmount)}
              </span>
            ) : (
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold uppercase text-emerald-600">
                Paid up
              </span>
            )}
          </div>

          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>{member.mobile}</span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />
              <span>{member.planName}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />
              <span>Expires {formatISODateTimeLabel(member.expiryDate)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
