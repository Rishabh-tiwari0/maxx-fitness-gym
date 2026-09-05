import { getAllMembers } from "@/lib/firebase/members";
import MembersView from "./members-view";

export const metadata = {
  title: "Members",
};

// Force fresh data on every request rather than caching the page, since
// membership records (payments, expiries) change frequently.
export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const members = await getAllMembers();
  return <MembersView members={members} />;
}
