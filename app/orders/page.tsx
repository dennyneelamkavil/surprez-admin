import { DashboardLayout } from "@/components/dashboard/layout"
import { OrderList } from "@/components/orders/order-list"

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <OrderList />
    </DashboardLayout>
  )
}
