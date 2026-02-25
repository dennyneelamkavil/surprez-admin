import { Metadata } from "next";
import CustomerViewClient from "../components/CustomerViewClient";

export const metadata: Metadata = {
  title: "View Customer | Surprez Admin",
  description: "View customer details in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function ViewCustomerPage({ params }: Params) {
  const { id } = await params;
  return <CustomerViewClient id={id} />;
}
