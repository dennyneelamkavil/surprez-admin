import Error403Client from "@/components/error/Error403Client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 – Access Denied | Surprez Admin",
  description:
    "You do not have permission to access this page in the Surprez admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Error403() {
  return <Error403Client />;
}
