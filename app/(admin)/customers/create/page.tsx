import { Metadata } from "next";
import CustomerFormClient from "../components/CustomerFormClient";

export const metadata: Metadata = {
  title: "Create Customer | Surprez Admin",
  description: "Create a new customer in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateCustomerPage() {
  return <CustomerFormClient mode="create" />;
}
