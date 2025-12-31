import { Metadata } from "next";
import SubCategoryFormClient from "@/components/subcategories/SubCategoryFormClient";

export const metadata: Metadata = {
  title: "Create SubCategory | Surprez Admin",
  description: "Create a new subcategory in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateSubCategoryPage() {
  return <SubCategoryFormClient mode="create" />;
}
