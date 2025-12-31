import { Metadata } from "next";
import ProductsListClient from "@/components/products/ProductsListClient";

export const metadata: Metadata = {
  title: "Products | Surprez Admin",
  description: "Manage products in the Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProductsPage() {
  return <ProductsListClient />;
}
