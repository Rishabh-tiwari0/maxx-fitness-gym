"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateLabel } from "@/lib/format";

/**
 * Dropdown menu that navigates to the member's detail page for each action.
 * Uses onSelect + router.push (the correct Radix UI navigation pattern).
 */
function MemberActions({ member }) {
  const router = useRouter();
  const base = `/admin/members/${member.id}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`More actions for ${member.name}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => router.push(base)}>
          View profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => router.push(`${base}?action=edit`)}>
          Edit plan
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push(`${base}#payments`)}>
          Payment history
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Recent member activity table: Name, Phone, Plan, Due Date, Status, Action.
 * @param {{
 *   members: import("../data/dashboard-data").MemberActivity[],
 *   loading?: boolean,
 *   onRemind?: (memberId: string) => void
 * }} props
 */
export function MemberTable({ members, loading = false, onRemind }) {
  return (
    <>
      {/* ── Mobile cards ── */}
      <div className="space-y-3 md:hidden">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            ))
          : members.map((member) => (
              <div
                key={member.id}
                className="rounded-lg border border-border bg-card p-3"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.phone}
                    </p>
                  </div>
                  <StatusBadge status={member.status} />
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between gap-3">
                    <span>Plan</span>
                    <span className="text-foreground">{member.plan}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Due</span>
                    <span>{formatDateLabel(member.dueDate)}</span>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  {member.status === "pending" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemind?.(member.id)}
                    >
                      Remind
                    </Button>
                  ) : (
                    <MemberActions member={member} />
                  )}
                </div>
              </div>
            ))}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, ci) => (
                      <TableCell key={ci}>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium text-foreground">
                      {member.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.phone}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.plan}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateLabel(member.dueDate)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={member.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {member.status === "pending" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRemind?.(member.id)}
                        >
                          Remind
                        </Button>
                      ) : (
                        <MemberActions member={member} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
