"use client";

import { useEffect, useMemo, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 3;

/**
 * Attendance table: checkbox, member (avatar + name), ID, check-in time.
 * Paginates client-side and resets to page 1 whenever the record set changes.
 * @param {{
 *   records: import("../lib/attendance").AttendanceRecord[],
 *   loading?: boolean
 * }} props
 */
export function AttendanceTable({ records, loading = false }) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    setPage(1);
  }, [records]);

  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
  const pageRecords = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return records.slice(start, start + PAGE_SIZE);
  }, [records, page]);

  const allOnPageSelected =
    pageRecords.length > 0 &&
    pageRecords.every((record) => selected[record.id]);

  function toggleAllOnPage() {
    setSelected((prev) => {
      const next = { ...prev };
      const shouldSelect = !allOnPageSelected;
      pageRecords.forEach((record) => {
        next[record.id] = shouldSelect;
      });
      return next;
    });
  }

  function toggleOne(id) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const rangeStart = records.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, records.length);

  return (
    <div className="space-y-3">
      <div className="md:hidden space-y-3">
        {loading ? (
          Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-card p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))
        ) : pageRecords.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            No members found. Try a different search or date.
          </div>
        ) : (
          pageRecords.map((record) => (
            <div
              key={record.id}
              className="rounded-lg border border-border bg-card p-3"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean(selected[record.id])}
                    onChange={() => toggleOne(record.id)}
                    aria-label={`Select ${record.name}`}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{record.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {record.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        #{record.memberCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Check-in</span>
                <span
                  className={
                    record.present ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  {record.checkInTime ?? "--:--"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={allOnPageSelected}
                  onChange={toggleAllOnPage}
                  aria-label="Select all members on this page"
                  className="h-4 w-4 rounded border-border accent-primary"
                />
              </TableHead>
              <TableHead>Member</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Check-in Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-14" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                </TableRow>
              ))
            ) : pageRecords.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No members found. Try a different search or date.
                </TableCell>
              </TableRow>
            ) : (
              pageRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={Boolean(selected[record.id])}
                      onChange={() => toggleOne(record.id)}
                      aria-label={`Select ${record.name}`}
                      className="h-4 w-4 rounded border-border accent-primary"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{record.initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">
                        {record.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {record.memberCode}
                  </TableCell>
                  <TableCell
                    className={
                      record.present
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {record.checkInTime ?? "--:--"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && (
        <div className="flex flex-col gap-3 px-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {rangeStart} to {rangeEnd} of {records.length} members
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
