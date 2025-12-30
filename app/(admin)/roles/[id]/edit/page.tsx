import { Metadata } from "next";
import RoleFormClient from "@/components/roles/RoleFormClient";

export const metadata: Metadata = {
  title: "Edit Role | Surprez Admin",
  description: "Edit role in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function EditRolePage({ params }: Params) {
  const { id } = await params;
  return <RoleFormClient mode="edit" id={id} />;
}
