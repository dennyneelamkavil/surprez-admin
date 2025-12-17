import { DashboardLayout } from "@/components/dashboard/layout"
import { OrderEditForm } from "@/components/orders/order-edit-form"

export default function EditOrderPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <OrderEditForm orderId={params.id} />
    </DashboardLayout>
  )
}
