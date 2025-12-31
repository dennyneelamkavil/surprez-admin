import { Metadata } from "next";
import UserFormClient from "../components/UserFormClient";

export const metadata: Metadata = {
  title: "Create User | Surprez Admin",
  description: "Create a new user in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateUserPage() {
  return <UserFormClient mode="create" />;
}
