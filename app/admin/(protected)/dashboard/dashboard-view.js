"use client";

import { useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { StatCard } from "@/components/StatCard";
import { MemberTable } from "@/components/MemberTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseDateValue, getMembershipStatus } from "@/lib/membership";

function toDashboardMember(member) {
  const id = String(member.memberId ?? member.id ?? "");
  const expiryDate = parseDateValue(member.expiryDate);
  const dueDate = expiryDate ? expiryDate.toISOString().slice(0, 10) : "";

  return {
    id,
    name: member.name ?? "Unknown member",
    phone: member.mobile ?? "N/A",
    plan: member.planName ?? "Monthly",
    dueDate,
    status: getMembershipStatus(member),
  };
}

/**
 * @param {{
 *   stats: import("@/lib/firebase/stats").DashboardStats,
 *   recentMembers: import("@/lib/firebase/members").Member[],
 *   monthlyCollection: number,
 * }} props
 */
export default function DashboardView({
  stats,
  recentMembers,
  monthlyCollection,
}) {
  // Stats come pre-computed from Firestore aggregation queries (4 reads total).
  // No need to iterate over all members here.
  const dashboardStats = useMemo(
    () => [
      {
        id: "total-members",
        label: "TOTAL MEMBERS",
        value: (stats.totalMembers ?? 0).toLocaleString(),
        accent: "none",
        icon: null,
      },
      {
        id: "active",
        label: "ACTIVE",
        value: (stats.activeMembers ?? 0).toLocaleString(),
        accent: "none",
        icon: "bolt",
      },
      {
        id: "expiring-soon",
        label: "EXPIRING SOON",
        value: (stats.expiringSoon ?? 0).toLocaleString(),
        accent: "warning",
        icon: null,
      },
      {
        id: "pending-amount",
        label: "PENDING AMOUNT",
        value: `₹${(stats.totalPending ?? 0).toLocaleString()}`,
        accent: "danger",
        icon: null,
      },
      {
        id: "monthly-collection",
        label: "MONTHLY COLLECTION",
        value: `₹${Number(monthlyCollection ?? 0).toLocaleString()}`,
        accent: "none",
        icon: null,
      },
    ],
    [stats, monthlyCollection],
  );

  // recentMembers is already the 5 soonest-expiring members from Firestore.
  const recentMemberActivity = useMemo(
    () => recentMembers.map(toDashboardMember),
    [recentMembers],
  );

  function handleRemind(memberId) {
    const member = recentMemberActivity.find((item) => item.id === memberId);
    toast.success("Reminder sent", {
      description: member
        ? `${member.name} was notified about their balance.`
        : undefined,
    });
  }

  return (
    <div className="container space-y-8 py-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of club performance and pending actions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            accent={stat.accent}
            icon={stat.icon}
          />
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Recent Member Activity</CardTitle>
          <Link
            href="/admin/attendance"
            className="text-sm font-semibold text-primary hover:underline"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          <MemberTable
            members={recentMemberActivity}
            loading={false}
            onRemind={handleRemind}
          />
        </CardContent>
      </Card>
    </div>
  );
}
