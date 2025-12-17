import { DashboardLayout } from "@/components/dashboard/layout"
import { CategoryList } from "@/components/categories/category-list"

export default function CategoriesPage() {
  return (
    <DashboardLayout>
      <CategoryList />
    </DashboardLayout>
  )
}
