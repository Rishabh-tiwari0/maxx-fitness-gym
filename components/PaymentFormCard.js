"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { paymentMethods } from "@/data/payment-data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatINR } from "@/lib/format";
import { isMembershipExpired } from "@/lib/membership";
import { cn } from "@/lib/utils";
import { recordPaymentAction } from "@/app/admin/(protected)/payment/actions";
import { PaymentReceiptDialog } from "@/components/PaymentReceiptDialog";

const PLAN_DURATION_MONTHS = {
  Monthly: 1,
  Quarterly: 3,
  "Half-Yearly": 6,
  Annual: 12,
};

/** Returns today + the plan's duration as a yyyy-mm-dd string. */
function computeRenewalDate(planName, from = new Date()) {
  const months = PLAN_DURATION_MONTHS[planName] ?? 1;
  const result = new Date(from);
  result.setMonth(result.getMonth() + months);
  return result.toISOString().slice(0, 10);
}

/**
 * @param {{ members: import("@/lib/firebase/members").Member[] }} props
 */
export function PaymentFormCard({ members }) {
  const [memberRows, setMemberRows] = useState(members);
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [newExpiryDate, setNewExpiryDate] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const selectedMember =
    memberRows.find((member) => member.memberId === selectedMemberId) ?? null;

  const filteredMembers = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return memberRows;
    return memberRows.filter(
      (member) =>
        member.name?.toLowerCase().includes(term) ||
        member.mobile?.includes(term),
    );
  }, [memberRows, query]);

  function handleSelectMember(member) {
    setSelectedMemberId(member.memberId);
    setAmount(member.pendingAmount > 0 ? String(member.pendingAmount) : "");
    // Auto-suggest a renewal date — especially useful when the member is expired.
    setNewExpiryDate(computeRenewalDate(member.planName));
    setQuery("");
    setIsSearchOpen(false);
    setFormError("");
  }

  function handlePayNowClick() {
    const numericAmount = Number.parseFloat(amount);
    if (!selectedMember) {
      setFormError("Select a member before recording a payment.");
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setFormError("Enter a valid payment amount.");
      return;
    }
    setFormError("");
    setConfirmOpen(true);
  }

  function resetForm() {
    setSelectedMemberId("");
    setAmount("");
    setMethod("cash");
    setNewExpiryDate("");
    setFormError("");
  }

  async function handleConfirmPayment() {
    setConfirmOpen(false);

    const member = selectedMember;
    const numericAmount = Number.parseFloat(amount);
    if (!member || !numericAmount || numericAmount <= 0) return;

    try {
      setSubmitting(true);

      const result = await recordPaymentAction({
        memberId: member.memberId,
        memberName: member.name,
        currentPaid: member.paid ?? 0,
        currentPending: member.pendingAmount ?? 0,
        amount: numericAmount,
        method,
        newExpiryDate: newExpiryDate || undefined,
      });

      if (!result.success) {
        toast.error("Couldn't record payment", { description: result.error });
        return;
      }

      setMemberRows((current) =>
        current.map((row) =>
          row.memberId === member.memberId
            ? {
                ...row,
                paid: result.paid,
                pendingAmount: result.pendingAmount,
                // Update expiryDate locally so status badge reflects Active immediately.
                ...(result.expiryDate ? { expiryDate: result.expiryDate } : {}),
              }
            : row,
        ),
      );

      // Show the receipt dialog — form reset happens when user closes it.
      setReceipt({
        memberName: member.name,
        memberId: member.memberId,
        mobile: member.mobile,
        planName: member.planName,
        amountPaid: numericAmount,
        method,
        paidAt: new Date().toISOString(),
        validUntil: result.expiryDate ?? newExpiryDate ?? undefined,
        pendingAmount: result.pendingAmount,
      });

      toast.success("Payment recorded", {
        description:
          result.pendingAmount > 0
            ? `${formatINR(numericAmount)} from ${member.name} — ${formatINR(result.pendingAmount)} still due.`
            : `${formatINR(numericAmount)} from ${member.name} — fully paid up.`,
      });
    } catch (error) {
      console.error("Failed to record payment:", error);
      toast.error("Couldn't record payment", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-4 px-0 sm:px-0">
      <Card>
        <CardHeader className="px-4 text-center sm:px-6">
          <CardTitle className="text-xl uppercase sm:text-2xl">
            Take Payment
          </CardTitle>
          <CardDescription>
            Record an offline payment for a member.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-4 sm:px-6">
          <div className="relative space-y-1.5">
            <Label htmlFor="member-search">Member Search</Label>
            <button
              type="button"
              id="member-search"
              onClick={() => setIsSearchOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={isSearchOpen}
              className="flex h-11 w-full items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className={cn(!selectedMember && "text-muted-foreground")}>
                {selectedMember ? selectedMember.name : "Select a member..."}
              </span>
              <ChevronDown
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </button>

            {isSearchOpen ? (
              <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
                <Input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name or mobile..."
                  aria-label="Search members"
                  className="rounded-none border-0 border-b border-border focus-visible:ring-0"
                />
                <ul role="listbox" className="max-h-52 overflow-y-auto py-1">
                  {filteredMembers.length === 0 ? (
                    <li className="px-3 py-2 text-sm text-muted-foreground">
                      No members found.
                    </li>
                  ) : (
                    filteredMembers.map((member) => (
                      <li key={member.memberId}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={member.memberId === selectedMemberId}
                          onClick={() => handleSelectMember(member)}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
                        >
                          <span>
                            {member.name}
                            <span className="ml-1.5 text-xs text-muted-foreground">
                              {member.mobile}
                            </span>
                          </span>
                          {member.pendingAmount > 0 ? (
                            <span className="text-xs font-semibold text-rose-600">
                              Due {formatINR(member.pendingAmount)}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Paid up
                            </span>
                          )}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ) : null}
          </div>

          {selectedMember ? (
            <p className="text-xs text-muted-foreground">
              {selectedMember.planName} plan · Paid{" "}
              {formatINR(selectedMember.paid ?? 0)} so far
            </p>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {paymentMethods.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMethod(option.id)}
                  aria-pressed={method === option.id}
                  className={cn(
                    "rounded-lg border border-border px-3 py-2.5 text-sm font-semibold transition-colors",
                    method === option.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-secondary/40 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {selectedMember ? (
            <div className="space-y-1.5">
              <Label
                htmlFor="new-expiry-date"
                className="flex items-center gap-1.5"
              >
                <CalendarDays
                  className="h-3.5 w-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                New Expiry Date
                {isMembershipExpired(selectedMember) && (
                  <span className="ml-1 rounded-full bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-rose-600">
                    Expired — renewal required
                  </span>
                )}
              </Label>
              <Input
                id="new-expiry-date"
                type="date"
                value={newExpiryDate}
                onChange={(event) => setNewExpiryDate(event.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Leave as-is to extend by plan duration, or set a custom date.
              </p>
            </div>
          ) : null}

          {formError ? (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          ) : null}

          <Button
            size="lg"
            className="glow-primary w-full uppercase tracking-wide"
            onClick={handlePayNowClick}
            disabled={submitting}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {submitting ? "Recording..." : "Pay Now"}
          </Button>
        </CardContent>
      </Card>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Secure Admin Transaction Portal
      </p>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedMember
                ? `Record ${formatINR(Number.parseFloat(amount) || 0)} from ${selectedMember.name} via ${method}?`
                : "Record this payment?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPayment}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PaymentReceiptDialog
        receipt={receipt}
        onClose={() => {
          setReceipt(null);
          resetForm();
        }}
      />
    </div>
  );
}
