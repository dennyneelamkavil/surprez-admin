import { Metadata } from "next";
import ProductFormClient from "@/components/products/ProductFormClient";

export const metadata: Metadata = {
  title: "Create Product | Surprez Admin",
  description: "Create a new product in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateProductPage() {
  return <ProductFormClient mode="create" />;
}
