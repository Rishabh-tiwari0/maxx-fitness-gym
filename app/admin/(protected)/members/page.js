"use client";

import { useMemo, useState } from "react";

import { MemberProfileCard } from "@/components/MemberProfileCard";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialMembers = [
  {
    id: "M-1001",
    name: "Tomás Delgado",
    phone: "718-0342",
    plan: "Monthly",
    dueDate: "18 Sep 2026",
    status: "pending",
  },
  {
    id: "M-1002",
    name: "Priya Sharma",
    phone: "718-0561",
    plan: "Quarterly",
    dueDate: "22 Sep 2026",
    status: "active",
  },
  {
    id: "M-1003",
    name: "Jordan Mills",
    phone: "718-0899",
    plan: "Half-Yearly",
    dueDate: "10 Sep 2026",
    status: "pending",
  },
  {
    id: "M-1004",
    name: "Lena Voss",
    phone: "718-0214",
    plan: "Annual",
    dueDate: "05 Oct 2026",
    status: "active",
  },
];

const defaultMemberForm = {
  name: "",
  phone: "",
  plan: "Monthly",
  fee: "",
  membershipStatus: "active",
  dueDate: "",
  emergencyContact: "",
  memberId: "",
};

export default function MembersPage() {
  const [members, setMembers] = useState(initialMembers);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(defaultMemberForm);

  const nextMemberNumber = useMemo(() => {
    const highest = members.reduce((max, member) => {
      const num = Number.parseInt(String(member.id).split("-")[1] ?? "0", 10);
      return Math.max(max, num);
    }, 1000);

    return highest + 1;
  }, [members]);

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedPhone = form.phone.trim();
    const trimmedMemberId = form.memberId.trim() || `M-${nextMemberNumber}`;
    const feeValue = Number.parseFloat(form.fee);

    if (
      !trimmedName ||
      !trimmedPhone ||
      !form.plan ||
      Number.isNaN(feeValue) ||
      feeValue <= 0
    ) {
      return;
    }

    const newMember = {
      id: trimmedMemberId,
      name: trimmedName,
      phone: trimmedPhone,
      plan: form.plan,
      fee: `₹${feeValue.toFixed(0)}`,
      dueDate: form.dueDate
        ? new Date(form.dueDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Plan start pending",
      status: form.membershipStatus,
      emergencyContact: form.emergencyContact || "Not provided",
    };

    setMembers((current) => [newMember, ...current]);
    setForm(defaultMemberForm);
    setIsOpen(false);
  }

  return (
    <div className="container space-y-6 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight">
            Members
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage member profiles and membership status.
          </p>
        </div>

        <Button
          className="uppercase tracking-wide"
          onClick={() => setIsOpen(true)}
        >
          Add New Member
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {members.map((member) => (
              <MemberProfileCard key={member.id} member={member} />
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Member</AlertDialogTitle>
            <AlertDialogDescription>
              Fill in the member details below to create a new profile.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="memberId">Member ID</Label>
                <Input
                  id="memberId"
                  name="memberId"
                  value={form.memberId}
                  onChange={handleFieldChange}
                  placeholder={`M-${nextMemberNumber}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleFieldChange}
                  placeholder="Enter member name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleFieldChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Membership Plan</Label>
                <select
                  id="plan"
                  name="plan"
                  value={form.plan}
                  onChange={handleFieldChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half-Yearly">Half-Yearly</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee">Fees</Label>
                <Input
                  id="fee"
                  name="fee"
                  type="number"
                  min="0"
                  step="1"
                  value={form.fee}
                  onChange={handleFieldChange}
                  placeholder="Enter fee amount"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="membershipStatus">Membership Status</Label>
                <select
                  id="membershipStatus"
                  name="membershipStatus"
                  value={form.membershipStatus}
                  onChange={handleFieldChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={handleFieldChange}
                placeholder="Optional"
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel
                type="button"
                onClick={() => setForm(defaultMemberForm)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction type="submit">Save Member</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
