import { Metadata } from "next";
import SeoListClient from "./components/SeoListClient";

export const metadata: Metadata = {
  title: "Seo | Surprez Admin",
  description: "Manage seo in the Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SeoPage() {
  return <SeoListClient />;
}
