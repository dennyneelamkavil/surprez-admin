import { Metadata } from "next";
import InventoryForm from "../../components/InventoryForm";

export const metadata: Metadata = {
  title: "Edit Product Inventory | Surprez Admin",
  description: "Edit product inventory in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string; inventoryId: string };
}

export default async function EditInventoryPage({ params }: Params) {
  const { id, inventoryId } = await params;
  return <InventoryForm mode="edit" productId={id} inventoryId={inventoryId} />;
}
