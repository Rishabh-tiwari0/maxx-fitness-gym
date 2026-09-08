"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { StatCard } from "@/components/StatCard";
import { MemberTable } from "@/components/MemberTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function parseDateValue(value) {
  if (!value) return null;

  if (typeof value?.toDate === "function") {
    return value.toDate();
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;

    const alt = new Date(
      value.replace(/\b(\d{1,2})\s+(\w{3})\s+(\d{4})\b/, "$1 $2 $3"),
    );
    if (!Number.isNaN(alt.getTime())) return alt;
  }

  return null;
}

function normalizeMemberStatus(member) {
  const pendingAmount = Number(member.pendingAmount ?? 0);
  if (pendingAmount > 0) return "pending";

  const expiry = parseDateValue(member.expiryDate);
  if (!expiry) return "active";

  return expiry.getTime() < Date.now() ? "expired" : "active";
}

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
    status: normalizeMemberStatus(member),
  };
}

/**
 * @param {{ members: import("@/lib/firebase/members").Member[] }} props
 */
export default function DashboardView({ members }) {
  const [rows] = useState(members);

  const dashboardStats = useMemo(() => {
    const totalMembers = rows.length;
    const activeCount = rows.filter(
      (member) => normalizeMemberStatus(member) === "active",
    ).length;
    const expiringSoon = rows.filter((member) => {
      const expiry = parseDateValue(member.expiryDate);
      if (!expiry) return false;
      const diffDays = (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }).length;
    const pendingAmount = rows.reduce(
      (sum, member) => sum + Number(member.pendingAmount ?? 0),
      0,
    );
    const monthlyCollection = rows.reduce(
      (sum, member) => sum + Number(member.paid ?? 0),
      0,
    );

    return [
      {
        id: "total-members",
        label: "TOTAL MEMBERS",
        value: totalMembers.toLocaleString(),
        accent: "none",
        icon: null,
      },
      {
        id: "active",
        label: "ACTIVE",
        value: activeCount.toLocaleString(),
        accent: "none",
        icon: "bolt",
      },
      {
        id: "expiring-soon",
        label: "EXPIRING SOON",
        value: expiringSoon.toLocaleString(),
        accent: "warning",
        icon: null,
      },
      {
        id: "pending-amount",
        label: "PENDING AMOUNT",
        value: `₹${pendingAmount.toLocaleString()}`,
        accent: "danger",
        icon: null,
      },
      {
        id: "monthly-collection",
        label: "MONTHLY COLLECTION",
        value: `₹${monthlyCollection.toLocaleString()}`,
        accent: "none",
        icon: null,
      },
    ];
  }, [rows]);

  const recentMemberActivity = useMemo(
    () =>
      rows
        .map(toDashboardMember)
        .sort((a, b) => {
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return aDate - bDate;
        })
        .slice(0, 5),
    [rows],
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
