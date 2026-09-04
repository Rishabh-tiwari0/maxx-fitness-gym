"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { SearchBar } from "@/components/SearchBar";
import { DatePickerField } from "@/components/DatePickerField";
import { AttendanceTable } from "@/components/AttendanceTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { attendanceMembers } from "@/data/attendance-data";
import { computeAttendanceRate, generateAttendanceForDate } from "@/lib/attendance";
import { todayISODate } from "@/lib/format";

export default function AttendanceView() {
  const today = useMemo(() => todayISODate(), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, [selectedDate]);

  const allRecordsForDate = useMemo(
    () => generateAttendanceForDate(selectedDate, attendanceMembers),
    [selectedDate]
  );

  const attendanceRate = computeAttendanceRate(allRecordsForDate);
  const presentCount = allRecordsForDate.filter((record) => record.present).length;

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allRecordsForDate;
    return allRecordsForDate.filter(
      (record) =>
        record.name.toLowerCase().includes(term) ||
        record.memberCode.toLowerCase().includes(term)
    );
  }, [allRecordsForDate, search]);

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
          <CardTitle>Today&apos;s Attendance</CardTitle>
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
                / {allRecordsForDate.length} Members ({presentCount} checked in)
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
          className="flex-1"
        />
        <DatePickerField
          value={selectedDate}
          onChange={setSelectedDate}
          max={today}
          ariaLabel="Select attendance date"
          className="sm:w-56"
        />
        <Button variant="outline" size="icon" aria-label="Filter results" className="shrink-0">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="pt-5">
          <AttendanceTable records={filteredRecords} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
