"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { MemberCard } from "@/components/MemberCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMembershipStatus } from "@/lib/membership";
import { addMemberAction } from "./actions";

const PAGE_SIZE = 12;

const PLAN_DURATION_MONTHS = {
  Monthly: 1,
  Quarterly: 3,
  "Half-Yearly": 6,
  Annual: 12,
};

/** Today + the plan's duration, as a yyyy-mm-dd string for a date input. */
function computeExpiryDate(planName, fromDate = new Date()) {
  const months = PLAN_DURATION_MONTHS[planName] ?? 1;
  const result = new Date(fromDate);
  result.setMonth(result.getMonth() + months);
  return result.toISOString().slice(0, 10);
}

function getDefaultForm() {
  return {
    name: "",
    mobile: "",
    age: "",
    gender: "male",
    email: "",
    planName: "Monthly",
    planAmount: "800",
    paid: "0",
    pendingAmount: "0",
    expiryDate: computeExpiryDate("Monthly"),
  };
}

/**
 * @param {{ members: import("@/lib/firebase/members").Member[] }} props
 */
export function MembersView({ members }) {
  const [memberRows, setMemberRows] = useState(members);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(getDefaultForm);
  const [submitting, setSubmitting] = useState(false);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return memberRows.filter((member) => {
      // Filter by status: active, pending, or expired
      if (statusFilter !== "all") {
        const status = getMembershipStatus(member);
        if (status !== statusFilter) return false;
      }

      if (!query) return true;

      const nameMatch = member.name?.toLowerCase().includes(query);
      const mobileMatch = member.mobile?.includes(query);
      return nameMatch || mobileMatch;
    });
  }, [memberRows, search, statusFilter]);

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

  function handleStatusFilterChange(event) {
    setStatusFilter(event.target.value);
    setPage(1);
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === "planName") {
        next.expiryDate = computeExpiryDate(value);
      }
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const mobile = form.mobile.trim();
    const planName = form.planName.trim();
    const planAmount = Number(form.planAmount || 0);
    const pendingAmount = Number(form.pendingAmount || 0);
    const ageValue = form.age === "" ? null : Number(form.age);

    if (
      !name ||
      !mobile ||
      !planName ||
      Number.isNaN(planAmount) ||
      planAmount <= 0
    ) {
      toast.error("Couldn't save member", {
        description:
          "Name, mobile, plan name, and a plan amount above 0 are required.",
      });
      return;
    }

    // Validate mobile: strip all non-digits, must be exactly 10 digits.
    const mobileDigits = mobile.replace(/\D/g, "");
    if (mobileDigits.length !== 10) {
      toast.error("Invalid mobile number", {
        description: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

    try {
      setSubmitting(true);

      const result = await addMemberAction({
        name,
        mobile,
        age: ageValue,
        gender: form.gender || "male",
        email: form.email.trim() || null,
        planName,
        planAmount,
        paid: Number(form.paid || 0),
        pendingAmount,
        expiryDate: form.expiryDate,
      });

      if (!result.success) {
        toast.error("Couldn't save member", { description: result.error });
        return;
      }

      setMemberRows((current) => [result.member, ...current]);
      setForm(getDefaultForm());
      setIsDialogOpen(false);
      setPage(1);
      toast.success("Member added", {
        description: `${result.member.name} was saved to Firestore.`,
      });
    } catch (error) {
      console.error("Failed to add member:", error);
      toast.error("Couldn't save member", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container space-y-6 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight">
            Members
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {statusFilter !== "all" || search.trim()
              ? `${filteredMembers.length} of ${memberRows.length} members`
              : `${memberRows.length} total members`}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
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

          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-36"
            aria-label="Filter members by status"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
          </select>

          <Button
            onClick={() => setIsDialogOpen(true)}
            className="w-full shrink-0 sm:w-auto"
          >
            Add Member
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          {pageMembers.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {search.trim() && statusFilter !== "all"
                ? `No ${statusFilter} members match "${search.trim()}".`
                : search.trim()
                  ? `No members match "${search.trim()}".`
                  : statusFilter !== "all"
                    ? `No members with status "${statusFilter}".`
                    : "No members found."}
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filteredMembers.length)} of{" "}
            {filteredMembers.length}
          </p>

          <div className="flex flex-wrap items-center gap-2">
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* w-full on mobile, capped at 2xl on desktop; h-dvh on mobile so it
            fills the viewport and the form is scrollable instead of cut off. */}
        <DialogContent className="flex max-h-[92dvh] w-full flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 border-b border-border px-5 py-4">
            <DialogTitle className="text-lg font-bold">
              Add New Member
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Fill in the member's details below to create their profile.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* ── Personal Info ── */}
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Personal Info
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleFieldChange}
                    placeholder="Enter member name"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mobile">Mobile *</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    inputMode="tel"
                    value={form.mobile}
                    onChange={handleFieldChange}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={form.age}
                    onChange={handleFieldChange}
                    placeholder="Optional"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleFieldChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    value={form.email}
                    onChange={handleFieldChange}
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* ── Plan & Payment ── */}
              <p className="mb-3 mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Plan & Payment
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="planName">Plan</Label>
                  <select
                    id="planName"
                    name="planName"
                    value={form.planName}
                    onChange={handleFieldChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="planAmount">Plan Amount *</Label>
                  <Input
                    id="planAmount"
                    name="planAmount"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={form.planAmount}
                    onChange={handleFieldChange}
                    placeholder="e.g. 800"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="paid">Paid Now</Label>
                  <Input
                    id="paid"
                    name="paid"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={form.paid}
                    onChange={handleFieldChange}
                    placeholder="Amount paid upfront"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pendingAmount">Pending Amount</Label>
                  <Input
                    id="pendingAmount"
                    name="pendingAmount"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={form.pendingAmount}
                    onChange={handleFieldChange}
                    placeholder="Balance due"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    value={form.expiryDate}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>
            </div>

            {/* Sticky footer — always visible even when form is scrolled */}
            <div className="shrink-0 border-t border-border bg-background px-5 py-3">
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setForm(getDefaultForm())}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto"
                >
                  {submitting ? "Saving..." : "Save Member"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MembersView;
