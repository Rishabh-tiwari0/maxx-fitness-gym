import { PaymentFormCard } from "@/components/PaymentFormCard";

export const metadata = {
  title: "Take Payment",
};

export default function AdminPaymentPage() {
  return (
    <div className="container py-10">
      <PaymentFormCard />
    </div>
  );
}
