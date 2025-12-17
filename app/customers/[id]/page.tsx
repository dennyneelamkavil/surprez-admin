import { DashboardLayout } from "@/components/dashboard/layout"
import { CustomerProfile } from "@/components/customers/customer-profile"

export default function CustomerProfilePage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <CustomerProfile customerId={params.id} />
    </DashboardLayout>
  )
}
