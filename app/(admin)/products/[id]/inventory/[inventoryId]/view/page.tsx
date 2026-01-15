import { Metadata } from "next";
import InventoryView from "../../components/InventoryView";

export const metadata: Metadata = {
  title: "View Product Inventory | Surprez Admin",
  description: "View product inventory details in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { inventoryId: string };
}

export default async function ViewInventoryPage({ params }: Params) {
  const { inventoryId } = await params;
  return <InventoryView inventoryId={inventoryId} />;
}
