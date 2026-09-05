import { getAllMembers } from "@/lib/firebase/members";
import { PaymentFormCard } from "@/components/PaymentFormCard";

export const metadata = {
  title: "Take Payment",
};

// Force fresh data on every request — pending dues change as soon as a
// payment is recorded, so this page shouldn't serve a cached member list.
export const dynamic = "force-dynamic";

export default async function AdminPaymentPage() {
  const members = await getAllMembers();
  return (
    <div className="container py-10">
      <PaymentFormCard members={members} />
    </div>
  );
}
