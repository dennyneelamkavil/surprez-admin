import { Metadata } from "next";
import CategoryFormClient from "@/components/categories/CategoryFormClient";

export const metadata: Metadata = {
  title: "Edit Category | Surprez Admin",
  description: "Edit category in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function EditCategoryPage({ params }: Params) {
  const { id } = await params;
  return <CategoryFormClient mode="edit" id={id} />;
}
