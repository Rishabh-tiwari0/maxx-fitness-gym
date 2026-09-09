"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { SearchBar } from "@/components/SearchBar";
import { DatePickerField } from "@/components/DatePickerField";
import { AttendanceTable } from "@/components/AttendanceTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { computeAttendanceRate } from "@/lib/attendance";
import { getInitials } from "@/lib/format";
import { db } from "@/lib/firebase/client";

/**
 * @param {{
 *   members: import("@/lib/firebase/members").Member[],
 *   initialAttendance: import("@/lib/firebase/attendance").AttendanceRecord[],
 *   today: string,
 *   adminEmail: string|null,
 * }} props
 */
export default function AttendanceView({
  members,
  initialAttendance,
  today,
  adminEmail,
}) {
  const [selectedDate, setSelectedDate] = useState(today);
  const [attendanceByMemberId, setAttendanceByMemberId] = useState(() =>
    toMap(initialAttendance),
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const isToday = selectedDate === today;

  useEffect(() => {
    // Already have this from the server for the initial date — skip refetch.
    if (selectedDate === today) {
      setAttendanceByMemberId(toMap(initialAttendance));
      return;
    }

    let cancelled = false;
    setLoading(true);

    const attendanceQuery = query(
      collection(db, "attendance"),
      where("date", "==", selectedDate),
    );

    getDocs(attendanceQuery)
      .then((snapshot) => {
        if (cancelled) return;
        const records = snapshot.docs.map((d) => d.data());
        setAttendanceByMemberId(toMap(records));
      })
      .catch((error) => {
        console.error("Failed to load attendance for date:", error);
        if (!cancelled) toast.error("Couldn't load attendance for that date.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, today, initialAttendance]);

  const records = useMemo(
    () =>
      members.map((member) => {
        const attendance = attendanceByMemberId[member.memberId];
        return {
          id: member.memberId,
          name: member.name,
          initials: getInitials(member.name || "?"),
          memberCode: member.memberId,
          present: Boolean(attendance),
          checkInTime: attendance?.checkInTime
            ? new Date(attendance.checkInTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null,
        };
      }),
    [members, attendanceByMemberId],
  );

  const attendanceRate = computeAttendanceRate(records);
  const presentCount = records.filter((record) => record.present).length;

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return records;
    return records.filter(
      (record) =>
        record.name.toLowerCase().includes(term) ||
        record.memberCode.toLowerCase().includes(term),
    );
  }, [records, search]);

  async function handleTogglePresent(memberId) {
    if (!isToday) return; // read-only for past dates

    setTogglingId(memberId);
    const docId = `${memberId}_${selectedDate}`;
    const alreadyPresent = Boolean(attendanceByMemberId[memberId]);

    try {
      if (alreadyPresent) {
        await deleteDoc(doc(db, "attendance", docId));
        setAttendanceByMemberId((prev) => {
          const next = { ...prev };
          delete next[memberId];
          return next;
        });
      } else {
        const checkInTime = new Date().toISOString();
        await setDoc(doc(db, "attendance", docId), {
          memberId,
          date: selectedDate,
          checkInTime,
          markedBy: adminEmail,
        });
        setAttendanceByMemberId((prev) => ({
          ...prev,
          [memberId]: {
            memberId,
            date: selectedDate,
            checkInTime,
            markedBy: adminEmail,
          },
        }));
      }
    } catch (error) {
      console.error("Failed to update attendance:", error);
      toast.error("Couldn't update attendance", {
        description:
          "Something went wrong writing to Firestore. Please try again.",
      });
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="container space-y-6 py-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight">
          Attendance Tracking
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor facility usage and track member consistency.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isToday ? "Today's Attendance" : "Attendance"}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-9 w-40" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-primary">
                {attendanceRate}%
              </span>
              <span className="text-sm text-muted-foreground">
                / {records.length} Members ({presentCount} checked in)
              </span>
            </div>
          )}
          <Progress value={loading ? 0 : attendanceRate} className="mt-4" />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search members..."
          ariaLabel="Search members"
          className="w-full flex-1"
        />
        <DatePickerField
          value={selectedDate}
          onChange={setSelectedDate}
          max={today}
          ariaLabel="Select attendance date"
          className="w-full sm:w-56"
        />
      </div>

      {!isToday && (
        <p className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
          Viewing a past date — read-only. Switch to today to mark attendance.
        </p>
      )}

      <Card>
        <CardContent className="pt-5">
          <AttendanceTable
            records={filteredRecords}
            loading={loading}
            readOnly={!isToday}
            togglingId={togglingId}
            onTogglePresent={handleTogglePresent}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function toMap(records) {
  return Object.fromEntries(records.map((record) => [record.memberId, record]));
}
