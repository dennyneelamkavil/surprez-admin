import { Metadata } from "next";
import SellersListClient from "./components/SellersListClient";

export const metadata: Metadata = {
  title: "Sellers | Surprez Admin",
  description: "Manage sellers in the Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SellersPage() {
  return <SellersListClient />;
}
