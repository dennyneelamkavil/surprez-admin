import { Metadata } from "next";
import SubCategoryFormClient from "@/components/subcategories/SubCategoryFormClient";

export const metadata: Metadata = {
  title: "Edit SubCategory | Surprez Admin",
  description: "Edit subcategory in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function EditSubCategoryPage({ params }: Params) {
  const { id } = await params;
  return <SubCategoryFormClient mode="edit" id={id} />;
}
