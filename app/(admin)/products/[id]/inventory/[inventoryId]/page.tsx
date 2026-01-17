import { Metadata } from "next";
import InventoryView from "../components/InventoryView";

export const metadata: Metadata = {
  title: "View Product Inventory | Surprez Admin",
  description: "View product inventory details in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string; inventoryId: string };
}

export default async function ViewInventoryPage({ params }: Params) {
  const { id, inventoryId } = await params;
  return <InventoryView productId={id} inventoryId={inventoryId} />;
}
