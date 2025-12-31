import { Metadata } from "next";
import UsersListClient from "./components/UsersListClient";

export const metadata: Metadata = {
  title: "Users | Surprez Admin",
  description: "Manage users in the Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UsersPage() {
  return <UsersListClient />;
}
