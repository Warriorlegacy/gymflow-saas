import { AppShell } from "@/components/app-shell";
import { PaymentsCrud } from "@/components/payments-crud";
import { getMembersData, getPaymentsData, getPlansData } from "@/lib/data";

export default async function PaymentsPage() {
  const [payments, members, plans] = await Promise.all([getPaymentsData(), getMembersData(), getPlansData()]);

  return (
    <AppShell heading="Payments" subheading="Track collections, pending dues, and member billing history without a paid gateway.">
      <PaymentsCrud payments={payments} members={members} plans={plans} />
    </AppShell>
  );
}
