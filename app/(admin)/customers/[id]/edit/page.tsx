import { Metadata } from "next";
import CustomerFormClient from "../../components/CustomerFormClient";

export const metadata: Metadata = {
  title: "Edit Customer | Surprez Admin",
  description: "Edit customer in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function EditCustomerPage({ params }: Params) {
  const { id } = await params;
  return <CustomerFormClient mode="edit" id={id} />;
}
