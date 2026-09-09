"use client";

import Link from "next/link";
import { CalendarDays, MessageCircle, Phone, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatINR, formatISODateTimeLabel, getInitials } from "@/lib/format";
import { isMembershipExpired, hasPendingDues } from "@/lib/membership";
import { buildWhatsAppUrl } from "@/lib/receipt";
import { brand } from "@/data/site-data";

/**
 * Builds a WhatsApp payment reminder message for the member.
 */
function buildReminderText(member) {
  const expired = isMembershipExpired(member);
  const lines = [
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🏋️ *${brand.name.toUpperCase()}*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `Dear *${member.name}*,`,
    ``,
  ];

  if (expired && member.pendingAmount > 0) {
    lines.push(
      `⚠️ Your membership has *expired* and you have a pending balance of *₹${Number(member.pendingAmount).toLocaleString("en-IN")}*.`,
      ``,
      `Please visit the gym or contact us to renew your membership and clear your dues.`,
    );
  } else if (expired) {
    lines.push(
      `⚠️ Your membership has *expired*.`,
      ``,
      `Please visit the gym or contact us to renew your membership.`,
    );
  } else if (member.pendingAmount > 0) {
    lines.push(
      `💰 You have a pending balance of *₹${Number(member.pendingAmount).toLocaleString("en-IN")}* on your membership.`,
      ``,
      `Please clear your dues at your earliest convenience.`,
    );
  }

  lines.push(
    ``,
    `📞 *Contact us:* ${brand.phone}`,
    ``,
    `_Thank you for being a valued member!_ 💪`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
  );

  return lines.join("\n");
}

/**
 * Summary card for one member, shown in the Members grid. The whole card is
 * a link to that member's details page, with a WhatsApp reminder button for
 * members with pending dues or expired memberships.
 * @param {{ member: import("@/lib/firebase/members").Member }} props
 */
export function MemberCard({ member }) {
  const expired = isMembershipExpired(member);
  const hasPending = hasPendingDues(member);
  const showReminder = true; // show on every card so admin can reach any member

  function handleWhatsAppReminder(e) {
    // Prevent the card's Link from navigating.
    e.preventDefault();
    e.stopPropagation();
    const text = buildReminderText(member);
    const url = buildWhatsAppUrl(member.mobile, text);
    window.open(url, "_blank", "noopener,noreferrer");
  }

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

            <div className="flex flex-col items-end gap-1">
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                  expired
                    ? "bg-rose-500/15 text-rose-600"
                    : "bg-emerald-500/15 text-emerald-600"
                }`}
              >
                {expired ? "Expired" : "Active"}
              </span>
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

          {showReminder && (
            <button
              onClick={handleWhatsAppReminder}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366]/10 px-3 py-1.5 text-xs font-semibold text-[#25D366] ring-1 ring-[#25D366]/30 transition-colors hover:bg-[#25D366]/20"
              aria-label={`Send WhatsApp reminder to ${member.name}`}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Send Reminder on WhatsApp
            </button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
