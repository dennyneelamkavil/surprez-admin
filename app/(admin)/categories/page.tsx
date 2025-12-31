import { Metadata } from "next";
import CategoriesListClient from "./components/CategoriesListClient";

export const metadata: Metadata = {
  title: "Categories | Surprez Admin",
  description: "Manage categories in the Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CategoriesPage() {
  return <CategoriesListClient />;
}
