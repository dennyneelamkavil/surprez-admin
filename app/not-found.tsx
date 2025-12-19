import NotFoundClient from "@/components/error/NotFoundClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 – Page Not Found | Surprez Admin",
  description:
    "The page you are looking for does not exist or has been moved in the Surprez admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <NotFoundClient />;
}
