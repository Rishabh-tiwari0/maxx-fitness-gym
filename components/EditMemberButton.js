"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMemberAction } from "@/app/admin/(protected)/members/actions";

const PLAN_DURATION_MONTHS = {
  Monthly: 1,
  Quarterly: 3,
  "Half-Yearly": 6,
  Annual: 12,
};

function computeExpiryDate(planName, fromDate = new Date()) {
  const months = PLAN_DURATION_MONTHS[planName] ?? 1;
  const result = new Date(fromDate);
  result.setMonth(result.getMonth() + months);
  return result.toISOString().slice(0, 10);
}

/** ISO string or Firestore timestamp → yyyy-mm-dd for a date input */
function toDateInputValue(value) {
  if (!value) return "";
  const date = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

/**
 * Edit Member button + dialog, rendered on the member detail page.
 * @param {{ member: import("@/lib/firebase/members").Member }} props
 */
export function EditMemberButton({ member }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(() => ({
    name: member.name ?? "",
    mobile: member.mobile ?? "",
    age: member.age != null ? String(member.age) : "",
    gender: member.gender ?? "male",
    email: member.email ?? "",
    planName: member.planName ?? "Monthly",
    planAmount: member.planAmount != null ? String(member.planAmount) : "",
    paid: member.paid != null ? String(member.paid) : "0",
    pendingAmount: member.pendingAmount != null ? String(member.pendingAmount) : "0",
    expiryDate: toDateInputValue(member.expiryDate),
  }));

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };
      // Auto-recalculate expiry when plan changes (from today).
      if (name === "planName") {
        next.expiryDate = computeExpiryDate(value);
      }
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const planAmount = Number(form.planAmount || 0);
    if (!form.name.trim() || !form.mobile.trim() || !form.planName.trim() || planAmount <= 0) {
      toast.error("Couldn't save changes", {
        description: "Name, mobile, plan name, and a plan amount above 0 are required.",
      });
      return;
    }

    try {
      setSubmitting(true);

      const result = await updateMemberAction(member.memberId, {
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        age: form.age === "" ? null : Number(form.age),
        gender: form.gender || "male",
        email: form.email.trim() || null,
        planName: form.planName.trim(),
        planAmount,
        paid: Number(form.paid || 0),
        pendingAmount: Number(form.pendingAmount || 0),
        expiryDate: form.expiryDate || null,
      });

      if (!result.success) {
        toast.error("Couldn't save changes", { description: result.error });
        return;
      }

      toast.success("Member updated", {
        description: `${form.name.trim()}'s details have been saved.`,
      });
      setOpen(false);
      // Re-fetch the server component so the detail page reflects the new data.
      router.refresh();
    } catch (error) {
      console.error("EditMemberButton submit failed:", error);
      toast.error("Couldn't save changes", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Pencil className="h-4 w-4" aria-hidden="true" />
        Edit Member
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update {member.name}&apos;s details. Changes are saved to Firestore immediately.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={form.name}
                  onChange={handleFieldChange}
                  placeholder="Enter member name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-mobile">Mobile</Label>
                <Input
                  id="edit-mobile"
                  name="mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={handleFieldChange}
                  placeholder="Enter mobile number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-age">Age</Label>
                <Input
                  id="edit-age"
                  name="age"
                  type="number"
                  min="0"
                  value={form.age}
                  onChange={handleFieldChange}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-gender">Gender</Label>
                <select
                  id="edit-gender"
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

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFieldChange}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-planName">Plan Name</Label>
                <select
                  id="edit-planName"
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

              <div className="space-y-2">
                <Label htmlFor="edit-planAmount">Plan Amount</Label>
                <Input
                  id="edit-planAmount"
                  name="planAmount"
                  type="number"
                  min="0"
                  value={form.planAmount}
                  onChange={handleFieldChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-paid">Paid</Label>
                <Input
                  id="edit-paid"
                  name="paid"
                  type="number"
                  min="0"
                  value={form.paid}
                  onChange={handleFieldChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-pendingAmount">Pending Amount</Label>
                <Input
                  id="edit-pendingAmount"
                  name="pendingAmount"
                  type="number"
                  min="0"
                  value={form.pendingAmount}
                  onChange={handleFieldChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-expiryDate">Expiry Date</Label>
                <Input
                  id="edit-expiryDate"
                  name="expiryDate"
                  type="date"
                  value={form.expiryDate}
                  onChange={handleFieldChange}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
