import { Metadata } from "next";
import SellerFormClient from "../components/SellerFormClient";

export const metadata: Metadata = {
  title: "Create Seller | Surprez Admin",
  description: "Create a new seller in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateSellerPage() {
  return <SellerFormClient mode="create" />;
}
