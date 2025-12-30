import { Metadata } from "next";
import PermissionsListClient from "@/components/permissions/PermissionsListClient";

export const metadata: Metadata = {
  title: "Permissions | Surprez Admin",
  description: "Manage permissions in the Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PermissionsPage() {
  return <PermissionsListClient />;
}
