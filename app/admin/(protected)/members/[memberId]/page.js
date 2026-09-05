import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CalendarCheck,
  CreditCard,
  Mail,
  Phone,
  User,
} from "lucide-react";

import { getMemberById } from "@/lib/firebase/members";
import { getMonthlyAttendanceCount } from "@/lib/firebase/attendance";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteMemberButton } from "@/components/DeleteMemberButton";
import { formatINR, formatISODateTimeLabel, getInitials } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { memberId } = await params;
  const member = await getMemberById(memberId);
  return {
    title: member ? `${member.name} — Member Details` : "Member not found",
  };
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

export default async function MemberDetailsPage({ params }) {
  const { memberId } = await params;
  const member = await getMemberById(memberId);

  if (!member) {
    notFound();
  }

  const isoMonth = new Date().toISOString().slice(0, 7); // "yyyy-mm"
  const monthlyAttendance = await getMonthlyAttendanceCount(memberId, isoMonth);

  const today = new Date();
  const expiry = member.expiryDate ? new Date(member.expiryDate) : null;
  const isExpired = expiry ? expiry.getTime() < today.getTime() : false;
  const hasPending = (member.pendingAmount ?? 0) > 0;
  const monthLabel = today.toLocaleDateString("en-US", { month: "long" });

  return (
    <div className="container space-y-6 py-8">
      <Link
        href="/admin/members"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Members
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">
            {getInitials(member.name || "?")}
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">
              {member.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Member #{member.memberId}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isExpired ? "destructive" : "secondary"}>
            {isExpired ? "Expired" : "Active"}
          </Badge>
          {hasPending ? (
            <Badge variant="destructive">
              {formatINR(member.pendingAmount)} due
            </Badge>
          ) : (
            <Badge variant="secondary">Paid up</Badge>
          )}
          <DeleteMemberButton
            memberId={member.memberId}
            memberName={member.name}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <User className="h-4 w-4 text-primary" aria-hidden="true" />
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <DetailRow label="Full Name" value={member.name} />
            <DetailRow
              label="Mobile"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <Phone
                    className="h-3.5 w-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {member.mobile || "—"}
                </span>
              }
            />
            <DetailRow
              label="Email"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <Mail
                    className="h-3.5 w-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {member.email || "—"}
                </span>
              }
            />
            <DetailRow label="Age" value={member.age ?? "—"} />
            <DetailRow
              label="Gender"
              value={
                member.gender
                  ? member.gender.charAt(0).toUpperCase() +
                    member.gender.slice(1)
                  : "—"
              }
            />
            <DetailRow
              label="Member Since"
              value={formatISODateTimeLabel(member.memberAdded)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <CreditCard className="h-4 w-4 text-primary" aria-hidden="true" />
            <CardTitle className="text-base">Membership & Payment</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <DetailRow label="Plan" value={member.planName || "—"} />
            <DetailRow
              label="Plan Amount"
              value={formatINR(member.planAmount)}
            />
            <DetailRow label="Amount Paid" value={formatINR(member.paid)} />
            <DetailRow
              label="Pending Amount"
              value={
                <span className={hasPending ? "text-rose-600" : undefined}>
                  {formatINR(member.pendingAmount)}
                </span>
              }
            />
            <DetailRow
              label="Purchase Date"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <Calendar
                    className="h-3.5 w-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {formatISODateTimeLabel(member.purchaseDate)}
                </span>
              }
            />
            <DetailRow
              label="Expiry Date"
              value={
                <span className={isExpired ? "text-rose-600" : undefined}>
                  {formatISODateTimeLabel(member.expiryDate)}
                </span>
              }
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2 space-y-0">
          <CalendarCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          <CardTitle className="text-base">Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-primary">
              {monthlyAttendance}
            </span>
            <span className="text-sm text-muted-foreground">
              days present in {monthLabel}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
