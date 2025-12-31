import { Metadata } from "next";
import PermissionFormClient from "../components/PermissionFormClient";

export const metadata: Metadata = {
  title: "Create Permission | Surprez Admin",
  description: "Create a new permission in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreatePermissionPage() {
  return <PermissionFormClient mode="create" />;
}
