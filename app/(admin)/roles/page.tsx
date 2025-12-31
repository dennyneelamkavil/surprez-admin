import { Metadata } from "next";
import RolesListClient from "./components/RolesListClient";

export const metadata: Metadata = {
  title: "Roles | Surprez Admin",
  description: "Manage roles in the Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RolesPage() {
  return <RolesListClient />;
}
