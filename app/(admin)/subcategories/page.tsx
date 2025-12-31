import { Metadata } from "next";
import SubCategoriesListClient from "@/components/subcategories/SubCategoriesListClient";

export const metadata: Metadata = {
  title: "SubCategories | Surprez Admin",
  description: "Manage subcategories in the Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubCategoriesPage() {
  return <SubCategoriesListClient />;
}
