import { Metadata } from "next";
import InventoryForm from "../components/InventoryForm";

export const metadata: Metadata = {
  title: "Create Product Inventory | Surprez Admin",
  description: "Create a new product inventory in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function CreateInventoryPage({ params }: Params) {
  const { id } = await params;
  return <InventoryForm mode="create" productId={id} />;
}
