"use client";

import { useMemo, useState } from "react";
import { ChevronDown, DollarSign, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { paymentMembers, paymentMethods } from "@/data/payment-data";
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
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PaymentFormCard() {
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const selectedMember =
    paymentMembers.find((member) => member.id === selectedMemberId) ?? null;

  const filteredMembers = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return paymentMembers;
    return paymentMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(term) ||
        member.memberCode.toLowerCase().includes(term),
    );
  }, [query]);

  function handleSelectMember(member) {
    setSelectedMemberId(member.id);
    setAmount(String(member.amountDue));
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

  function handleConfirmPayment() {
    setConfirmOpen(false);
    toast.success("Payment recorded", {
      description: `${formatCurrency(Number.parseFloat(amount))} from ${selectedMember.name}`,
    });
    setSelectedMemberId("");
    setAmount("");
    setMethod("cash");
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-4 px-1 sm:px-0">
      <Card>
        <CardHeader className="px-4 text-center sm:px-6">
          <CardTitle className="text-xl uppercase sm:text-2xl">
            Take Payment
          </CardTitle>
          <CardDescription>
            Process a new transaction for a member.
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
                  placeholder="Search by name or ID..."
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
                      <li key={member.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={member.id === selectedMemberId}
                          onClick={() => handleSelectMember(member)}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
                        >
                          <span>{member.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {member.memberCode}
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ) : null}
          </div>

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
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
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

          {formError ? (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          ) : null}

          <Button
            size="lg"
            className="glow-primary w-full uppercase tracking-wide"
            onClick={handlePayNowClick}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Pay Now
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
                ? `Record ${formatCurrency(Number.parseFloat(amount) || 0)} from ${selectedMember.name} via ${method}?`
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
    </div>
  );
}
