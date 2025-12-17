import { DashboardLayout } from "@/components/dashboard/layout"
import { CustomerEditForm } from "@/components/customers/customer-edit-form"

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <CustomerEditForm customerId={params.id} />
    </DashboardLayout>
  )
}
