import { Metadata } from "next";
import CategoryFormClient from "../components/CategoryFormClient";

export const metadata: Metadata = {
  title: "Create Category | Surprez Admin",
  description: "Create a new category in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateCategoryPage() {
  return <CategoryFormClient mode="create" />;
}
