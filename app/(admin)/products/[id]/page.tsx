import { Metadata } from "next";
import ProductViewClient from "../components/ProductViewClient";

export const metadata: Metadata = {
  title: "View Product | Surprez Admin",
  description: "View product details in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function ViewProductPage({ params }: Params) {
  const { id } = await params;
  return <ProductViewClient id={id} />;
}
