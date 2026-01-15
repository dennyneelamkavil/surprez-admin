import { Metadata } from "next";
import InventoriesList from "./components/InventoriesList";

export const metadata: Metadata = {
  title: "Product Inventories | Surprez Admin",
  description: "Manage product inventories in the Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { productId: string };
}

export default async function ProductInventoriesPage({ params }: Params) {
  const { productId } = await params;
  return <InventoriesList productId={productId} />;
}
