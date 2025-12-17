import { DashboardLayout } from "@/components/dashboard/layout"
import { ProductForm } from "@/components/products/product-form"

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <ProductForm productId={params.id} />
    </DashboardLayout>
  )
}
