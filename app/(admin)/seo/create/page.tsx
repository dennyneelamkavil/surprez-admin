import { Metadata } from "next";
import SeoFormClient from "../components/SeoFormClient";

export const metadata: Metadata = {
  title: "Create Seo | Surprez Admin",
  description: "Create a new seo in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateSeoPage() {
  return <SeoFormClient mode="create" />;
}
