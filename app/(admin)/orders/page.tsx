import { Metadata } from "next";
import OrdersListClient from "./components/OrdersListClient";

export const metadata: Metadata = {
  title: "Orders | Surprez Admin",
  description: "Manage orders in the Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrdersPage() {
  return <OrdersListClient />;
}
