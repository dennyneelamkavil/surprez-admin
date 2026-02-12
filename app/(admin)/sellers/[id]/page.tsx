import { Metadata } from "next";
import SellerViewClient from "../components/SellerViewClient";

export const metadata: Metadata = {
  title: "View Seller | Surprez Admin",
  description: "View seller details in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function ViewSellerPage({ params }: Params) {
  const { id } = await params;
  return <SellerViewClient id={id} />;
}
