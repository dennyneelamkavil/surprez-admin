import { Metadata } from "next";
import OrderViewClient from "../components/OrderViewClient";

export const metadata: Metadata = {
  title: "View Order | Surprez Admin",
  description: "View order details in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function ViewOrderPage({ params }: Params) {
  const { id } = await params;
  return <OrderViewClient id={id} />;
}
