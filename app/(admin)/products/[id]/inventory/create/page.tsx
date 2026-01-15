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

export default function CreateInventoryPage() {
  return <InventoryForm mode="create" />;
}
