import { getRecentActivityMembers } from "@/lib/firebase/members";
import { getDashboardStats } from "@/lib/firebase/stats";
import { getMonthlyCollectionTotal } from "@/lib/firebase/payments";
import DashboardView from "./dashboard-view";

export const metadata = {
  title: "Admin Dashboard",
};

// force-dynamic so stats always reflect the latest state.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // 4 reads (aggregation) + 5 reads (recent members) + 1 read (payments cache)
  // = 10 reads total, down from 816+ reads with getAllMembers().
  const [stats, recentMembers, monthlyCollection] = await Promise.all([
    getDashboardStats(),
    getRecentActivityMembers(),
    getMonthlyCollectionTotal(),
  ]);
  return (
    <DashboardView
      stats={stats}
      recentMembers={recentMembers}
      monthlyCollection={monthlyCollection}
    />
  );
}
