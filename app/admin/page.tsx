import { DashboardLayout } from "@/components/dashboard/layout"
import { AdminUsers } from "@/components/admin/admin-users"

export default function AdminPage() {
  return (
    <DashboardLayout>
      <AdminUsers />
    </DashboardLayout>
  )
}
