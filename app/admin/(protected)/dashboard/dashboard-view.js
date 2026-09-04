"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { MemberTable } from "@/components/MemberTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardStats, recentMemberActivity } from "@/data/dashboard-data";
import { toast } from "sonner";

export default function DashboardView() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  function handleRemind(memberId) {
    const member = recentMemberActivity.find((item) => item.id === memberId);
    toast.success("Reminder sent", {
      description: member ? `${member.name} was notified about their balance.` : undefined,
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-xl" />
            ))
          : dashboardStats.map((stat) => (
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
            loading={loading}
            onRemind={handleRemind}
          />
        </CardContent>
      </Card>
    </div>
  );
}
