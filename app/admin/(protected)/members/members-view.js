"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { MemberCard } from "@/components/MemberCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 12;

/**
 * @param {{ members: import("@/lib/firebase/members").Member[] }} props
 */
export function MembersView({ members }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return members;

    return members.filter((member) => {
      const nameMatch = member.name?.toLowerCase().includes(query);
      const mobileMatch = member.mobile?.includes(query);
      return nameMatch || mobileMatch;
    });
  }, [members, search]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageMembers = filteredMembers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  return (
    <div className="container space-y-6 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight">
            Members
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {members.length} total members
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or mobile number"
            className="pl-9"
            aria-label="Search members by name or mobile number"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          {pageMembers.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No members match &quot;{search}&quot;.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {pageMembers.map((member) => (
                <MemberCard key={member.memberId} member={member} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {filteredMembers.length > 0 ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filteredMembers.length)} of{" "}
            {filteredMembers.length}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
