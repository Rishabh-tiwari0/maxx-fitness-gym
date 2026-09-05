"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteMemberAction } from "@/app/admin/(protected)/members/[memberId]/actions";

/**
 * Destructive "delete member" control. Requires typing the member's exact
 * name before the delete action enables, since this permanently removes
 * the Firestore document and cannot be undone.
 * @param {{ memberId: string, memberName: string }} props
 */
export function DeleteMemberButton({ memberId, memberName }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const canDelete = confirmText.trim() === memberName;

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteMemberAction(memberId);
    setDeleting(false);

    if (!result.success) {
      toast.error("Couldn't delete member", { description: result.error });
      return;
    }

    setOpen(false);
    toast.success("Member deleted", {
      description: `${memberName} has been permanently removed.`,
    });
    router.push("/admin/members");
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setConfirmText("");
      }}
    >
      <Button variant="destructive" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Delete Member
      </Button>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {memberName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the member record from the database. This
            cannot be undone. Payment and attendance history for this member
            will NOT be deleted automatically.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-1.5 py-2">
          <Label htmlFor="confirm-name">
            Type <span className="font-semibold">{memberName}</span> to confirm
          </Label>
          <Input
            id="confirm-name"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            autoComplete="off"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!canDelete || deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? "Deleting..." : "Delete Permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
