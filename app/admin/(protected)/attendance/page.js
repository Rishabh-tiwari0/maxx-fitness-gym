import { getAllMembers } from "@/lib/firebase/members";
import { getAttendanceForDate } from "@/lib/firebase/attendance";
import { getSessionUser } from "@/lib/session";
import { todayISODate } from "@/lib/format";
import AttendanceView from "./attendance-view";

export const metadata = {
  title: "Attendance Tracking",
};

// Force fresh data — attendance changes as soon as someone is checked in.
export const dynamic = "force-dynamic";

export default async function AdminAttendancePage() {
  const today = todayISODate();
  const [members, todaysAttendance, user] = await Promise.all([
    getAllMembers(),
    getAttendanceForDate(today),
    getSessionUser(),
  ]);

  return (
    <AttendanceView
      members={members}
      initialAttendance={todaysAttendance}
      today={today}
      adminEmail={user?.email ?? null}
    />
  );
}
