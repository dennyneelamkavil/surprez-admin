import { DashboardLayout } from "@/components/dashboard/layout"
import { CustomerList } from "@/components/customers/customer-list"

export default function CustomersPage() {
  return (
    <DashboardLayout>
      <CustomerList />
    </DashboardLayout>
  )
}
