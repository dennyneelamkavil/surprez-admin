import { Metadata } from "next";
import SellerFormClient from "../../components/SellerFormClient";

export const metadata: Metadata = {
  title: "Edit Seller | Surprez Admin",
  description: "Edit seller in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function EditSellerPage({ params }: Params) {
  const { id } = await params;
  return <SellerFormClient mode="edit" id={id} />;
}
