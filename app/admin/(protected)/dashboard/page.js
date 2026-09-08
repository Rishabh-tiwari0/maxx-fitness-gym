import { getAllMembers } from "@/lib/firebase/members";
import DashboardView from "./dashboard-view";

export const metadata = {
  title: "Admin Dashboard",
};

// Data comes from the cached getAllMembers() (see lib/firebase/members.js) —
// this page itself stays per-request but no longer means a fresh Firestore
// read every time.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const members = await getAllMembers();
  return <DashboardView members={members} />;
}